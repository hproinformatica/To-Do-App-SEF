import { NavigationActions } from 'react-navigation';

let _topLevelNavigator;

function setTopLevelNavigator(navigatorRef) {
    _topLevelNavigator = navigatorRef;
}

function navigate(routeName, params) {
    _topLevelNavigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}

export default {
    setTopLevelNavigator,
    navigate,
};