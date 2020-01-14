import React, {Component} from 'react'
import {
    FlatList,
    View,
    StyleSheet,
    Platform,
    Alert,
    DeviceEventEmitter,
    NativeModules,
    Animated,
    Linking,
    ScrollView,
    AppState, TouchableOpacity, Image, Text, RefreshControl,
    TextInput
} from 'react-native'
import {Colors} from '../../utils/Styles';
import {NaviBarHeight, ScreenDimensions} from '../../utils/Dimensions';
import {PLATFORM} from '../../utils/CustomEnums';
import {Navigation} from 'react-native-navigation';

export default class LogInViewController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            password: ''
        }
    }
    render() {
        let buttonWidth = (ScreenDimensions.width - 40 - 16)/2.0
        let buttonHeight = ScreenDimensions.width*(50.0/375)
        return(
            <View style={{flex: 1, backgroundColor: Colors.white,
                alignItems: 'center', justifyContent: 'space-between'
            }}>
                <View style={{flex: 1, backgroundColor: Colors.white,
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 32, fontWeight: 'bold',
                        color: Colors.lightBlack, marginTop: (PLATFORM.isIOS ? 44 : 20)
                    }}>Doctor Finder</Text>

                    <Text style={{fontSize: 24, fontWeight: 'bold',
                        color: Colors.lightBlack, marginTop: 60
                    }}>Sign in to your account</Text>

                    <TextInput
                        clearButtonMode={'while-editing'}
                        onChangeText={(text) => {
                            this.setState({account: text + ''})
                        }}
                        selectionColor = {Colors.theme}
                        // value = {this.state.searchContent}
                        underlineColorAndroid = {'transparent'}
                        numberOfLines={1}
                        placeholder = {'Account'}
                        placeholderTextColor={Colors.lightGray}
                        style={{width: ScreenDimensions.width - 40, marginTop: 40,
                            height: 40, textAlign: 'left', paddingLeft: 8, fontSize: 16,
                            color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
                            borderWidth: 1.0, borderColor: Colors.theme
                        }}/>

                    <TextInput
                        secureTextEntry={true}
                        clearButtonMode={'while-editing'}
                        onChangeText={(text) => {
                            this.setState({password: text + ''})
                        }}
                        selectionColor = {Colors.theme}
                        // value = {this.state.searchContent}
                        underlineColorAndroid = {'transparent'}
                        numberOfLines={1}
                        placeholder = {'Password'}
                        placeholderTextColor={Colors.lightGray}
                        style={{width: ScreenDimensions.width - 40, marginTop: 20,
                            height: 40, textAlign: 'left', paddingLeft: 8, fontSize: 16,
                            color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
                            borderWidth: 1.0, borderColor: Colors.theme
                        }}/>

                    <TouchableOpacity style={{
                        height: 30, justifyContent: 'center', alignItems: 'center',
                        marginTop: 8
                    }}>
                        <Text style={{fontSize: 16, color: Colors.theme,}}>{'Forgot password?'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{width: ScreenDimensions.width - 40,
                        height: buttonHeight, justifyContent: 'center', alignItems: 'center',
                        backgroundColor: Colors.theme, borderRadius: 4,
                        marginTop: 20
                    }}>
                        <Text style={{fontSize: 18, color: Colors.white, fontWeight: 'bold'}}>{'Create account'}</Text>
                    </TouchableOpacity>

                    <Text style={{fontSize: 16, color: Colors.lightBlack, marginTop: 16}}>{'Are you new with Doc Finder?'}</Text>

                    <TouchableOpacity style={{
                        height: 30, justifyContent: 'center', alignItems: 'center',
                    }}>
                        <Text style={{fontSize: 16, color: Colors.theme,}}>{'Create account'}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => {
                    Navigation.dismissModal(this.props.componentId);
                }} style={{
                    height: 30, justifyContent: 'center', alignItems: 'center',
                    marginBottom: PLATFORM.isIPhoneX ? 34 : 20
                }}>
                    <Text style={{fontSize: 16, color: Colors.theme,}}>{'Dismiss'}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
