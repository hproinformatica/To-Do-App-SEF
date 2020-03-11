import {
    HProWS,
    SQLiteWrapper,
    delayedAlert,
    getFormattedDate,
    getFormattedTime
} from 'hpro-rn';
import AppStorage from '../storage/AppStorage';

export async function syncApp() {
    try {
        let userData = '';
        let customersData = '';
        let salesOrdersData = '';

        const userInfo = await AppStorage.loadUserInfo();
        userData = JSON.stringify(userInfo);


        let resultSet = await SQLiteWrapper.executeSqlAsync('select * from hcli where flg=1');
        customersData = JSON.stringify(resultSet.rows._array);

        resultSet = await SQLiteWrapper.executeSqlAsync('select * from hpev where flg=1');
        let salesOrders = resultSet.rows._array;

        for (let salesOrder of salesOrders) {
            resultSet = await SQLiteWrapper.executeSqlAsync(
                'select * from hive where num=?',
                [salesOrder.num]);
            salesOrder.items = resultSet.rows._array;
        }
        salesOrdersData = JSON.stringify(salesOrders);


        const processResponse = await HProWS.process('SYNC_APP', { user: userData, customers: customersData, salesOrders: salesOrdersData });

        const processResponseObj = JSON.parse(processResponse);
        const success = processResponseObj.success;
        const content = processResponseObj.content;

        if (success) {
            await resetDatabaseStructure();

            await SQLiteWrapper.transactionAsync(transaction => {
                transaction.executeSql('drop table if exists hcli');
                transaction.executeSql('create table if not exists hcli (cod integer primary key, raz varchar(40), fan varchar(40), cpf varchar(14), cpj varchar(20), end varchar(40), nue varchar(10), coe varchar(10), bai varchar(30), cid varchar(32), est varchar(2), cep varchar(10), tel varchar(30), cel varchar(30), flg integer default 0, new integer default 0)');

                transaction.executeSql('drop table if exists hmat');
                transaction.executeSql("create table if not exists hmat (cod integer, des varchar(40), ref varchar(20) default '', pve decimal(9, 4), uni varchar(2))");

                transaction.executeSql('drop table if exists hmui');
                transaction.executeSql('create table if not exists hmui (cod integer, uf varchar(2), cid varchar(32))');

                transaction.executeSql('drop table if exists hufs');
                transaction.executeSql('create table if not exists hufs (sig varchar(2), nom varchar(30))');

                transaction.executeSql('drop table if exists hpev');
                transaction.executeSql("create table if not exists hpev (num varchar(9) default 'appkey', dat varchar(10), cli integer, ven integer, tot decimal(9,2), flg integer default 0, new integer default 0)");
                transaction.executeSql("create trigger hpev_appkey after insert on hpev begin update hpev set num = ('PV' || substr('000000', 1, 6 - length((select count(*) from hpev where new = 1))) || (select count(*) from hpev where new = 1)) where (num = 'appkey') and (new = 1); end;");

                transaction.executeSql('drop table if exists hive');
                transaction.executeSql('create table if not exists hive (num varchar(9), seq integer default 0, mat integer, des varchar(40), uni varchar(3), ref varchar(20), qtd decimal(7, 4), pre decimal(9, 4), tot decimal(9, 2), flg integer default 0, new integer default 0)');
                transaction.executeSql('create trigger hive_increment after insert on hive begin update hive set seq = (select max(seq) from hive where num = new.num) + 1 where num = new.num and seq = 0; end;');

                transaction.executeSql('delete from hcli');
                for (let customer of content.customers) {
                    transaction.executeSql(
                        'insert into hcli (cod, raz, fan, cpf, cpj, end, nue, coe, bai, cid, est, cep, tel, cel) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [customer.cod, customer.raz, customer.fan, customer.cpf, customer.cpj, customer.end, customer.nue, customer.coe, customer.bai, customer.cid, customer.est, customer.cep, customer.tel, customer.cel]
                    );
                }

                transaction.executeSql('delete from hmat');
                for (let product of content.products) {
                    transaction.executeSql(
                        'insert into hmat (cod, des, ref, pve, uni) values (?, ?, ?, ?, ?)',
                        [product.cod, product.des, product.ref, product.pve, product.uni]
                    );
                }

                transaction.executeSql('delete from hmui');
                for (let countie of content.counties) {
                    transaction.executeSql(
                        'insert into hmui (cod, uf, cid) values (?, ?, ?)',
                        [countie.cod, countie.uf, countie.cid]
                    );
                }

                transaction.executeSql('delete from hufs');
                for (let state of content.states) {
                    transaction.executeSql(
                        'insert into hufs (sig, nom) values (?, ?)',
                        [state.sig, state.nom]
                    );
                }

                transaction.executeSql('delete from hpev');
                for (let salesOrder of content.salesOrders) {
                    transaction.executeSql(
                        'insert into hpev (num, dat, cli, ven, tot) values (?, ?, ?, ?, ?)',
                        [salesOrder.num, salesOrder.dat, salesOrder.cli, salesOrder.ven, salesOrder.tot]
                    );
                }

                transaction.executeSql('delete from hive');
                for (let salesOrderItem of content.salesOrderItems) {
                    transaction.executeSql(
                        'insert into hive (num, seq, mat, des, uni, ref, qtd, pre, tot) values (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [salesOrderItem.num, salesOrderItem.seq, salesOrderItem.mat, salesOrderItem.des, salesOrderItem.uni, salesOrderItem.ref, salesOrderItem.qtd, salesOrderItem.pre, salesOrderItem.tot]
                    );
                }
            });

            const date = new Date();
            await AppStorage.saveSyncInfo(getFormattedDate(date), getFormattedTime(date));

            delayedAlert('Aplicativo sincronizado com sucesso!');

        } else {
            delayedAlert('Atenção', content.message);
        }

    } catch (error) {
        delayedAlert('Error', error.message);
    }
}

export async function resetDatabaseStructure() {
    try {
        await SQLiteWrapper.transactionAsync(transaction => {
            transaction.executeSql('drop table if exists hcli');
            transaction.executeSql('create table if not exists hcli (cod integer primary key, raz varchar(40), fan varchar(40), cpf varchar(14), cpj varchar(20), end varchar(40), nue varchar(10), coe varchar(10), bai varchar(30), cid varchar(32), est varchar(2), cep varchar(10), tel varchar(30), cel varchar(30), flg integer default 0, new integer default 0)');

            transaction.executeSql('drop table if exists hmat');
            transaction.executeSql("create table if not exists hmat (cod integer, des varchar(40), ref varchar(20) default '', pve decimal(9, 4), uni varchar(2))");

            transaction.executeSql('drop table if exists hmui');
            transaction.executeSql('create table if not exists hmui (cod integer, uf varchar(2), cid varchar(32))');

            transaction.executeSql('drop table if exists hufs');
            transaction.executeSql('create table if not exists hufs (sig varchar(2), nom varchar(30))');

            transaction.executeSql('drop table if exists hpev');
            transaction.executeSql("create table if not exists hpev (num varchar(9) default 'appkey', dat varchar(10), cli integer, ven integer, tot decimal(9,2), flg integer default 0, new integer default 0)");
            transaction.executeSql("create trigger hpev_appkey after insert on hpev begin update hpev set num = ('PV' || substr('000000', 1, 6 - length((select count(*) from hpev where new = 1))) || (select count(*) from hpev where new = 1)) where (num = 'appkey') and (new = 1); end;");

            transaction.executeSql('drop table if exists hive');
            transaction.executeSql('create table if not exists hive (num varchar(9), seq integer default 0, mat integer, des varchar(40), uni varchar(3), ref varchar(20), qtd decimal(7, 4), pre decimal(9, 4), tot decimal(9, 2), flg integer default 0, new integer default 0)');
            transaction.executeSql('create trigger hive_increment after insert on hive begin update hive set seq = (select max(seq) from hive where num = new.num) + 1 where num = new.num and seq = 0; end;');
        });
    } catch (error) {
        delayedAlert(error.message);
    }
}