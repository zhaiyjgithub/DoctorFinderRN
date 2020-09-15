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
    Keyboard, TouchableOpacity, Image, Text, RefreshControl,
    TextInput
} from 'react-native'
import {Colors} from '../../utils/Styles';
import {NaviBarHeight, ScreenDimensions} from '../../utils/Dimensions';
import {DBKey, PLATFORM} from '../../utils/CustomEnums';
import {Navigation} from 'react-native-navigation';
import {BaseNavigatorOptions} from '../../BaseComponents/BaseNavigatorOptions';
import Toast from 'react-native-simple-toast'
import LoadingSpinner from '../../BaseComponents/LoadingSpinner';
import {HTTP} from '../../utils/HttpTools';
import {API_Answer, API_Register} from '../../utils/API';
import {CacheDB} from '../../utils/DBTool';
import RouterEntry from '../../router/RouterEntry';
import {MD5Encrypt} from '../../utils/Utils';

export default class LogInViewController extends Component{
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            password: '',
            isSpinnerVisible: false
        }
    }

    showSpinner() {
        this.setState({isSpinnerVisible: true})
    }

    hideSpinner() {
        this.setState({isSpinnerVisible: false})
    }

    signIn() {
        if (!this.state.account.length) {
            Toast.showWithGravity('Email can`t be empty!', Toast.LONG, Toast.CENTER)
            return
        }

        if (!this.state.password.length) {
            Toast.showWithGravity('Password can`t be empty!', Toast.LONG, Toast.CENTER)
            return
        }


        let encryptPwd = MD5Encrypt(this.state.account.toLowerCase() + this.state.password.toLowerCase())

        let param = {
            Email: this.state.account,
            Password: encryptPwd
        }

        this.showSpinner()
        HTTP.post(API_Register.signIn, param).then((response) => {
            this.hideSpinner()

            if (!response.code) {
                let userInfo = response.data
                CacheDB.save(DBKey.userInfo, userInfo)

                global.UserInfo = userInfo

                RouterEntry.homePage()
            }else {
                Toast.showWithGravity('Email or password is wrong!', Toast.LONG, Toast.CENTER)
            }
        }).catch((error) => {
            this.hideSpinner()
            Toast.showWithGravity('Request failed!', Toast.LONG, Toast.CENTER)
        })
    }

    pushToVerifyAccountPage() {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'VerifyAccountViewController',
                passProps: {

                },
                options: {
                    statusBar: {
                        visible: true,
                        style: 'light'
                    },
                    topBar: {
                        visible: true,
                        title: {
                            text: 'Verify Account'
                        }
                    },
                }
            }
        })
    }

    modalSignUpPage() {
        Navigation.showModal({
            stack: {
                children: [{
                    component: {
                        name: 'SignUpViewController',
                        passProps: {

                        },
                        options: {
                            topBar: {
                                visible: false
                            }
                        }
                    }
                }]
            }
        });
    }

    render() {
        let buttonHeight = ScreenDimensions.width*(50.0/375)
        return(
            <TouchableOpacity activeOpacity={1} onPress={() => {
                Keyboard.dismiss()
            }} style={{flex: 1, backgroundColor: Colors.white,
                alignItems: 'center', justifyContent: 'space-between'
            }}>
                <View style={{flex: 1, backgroundColor: Colors.white,
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 32, fontWeight: 'bold',
                        color: Colors.lightBlack, marginTop: (PLATFORM.isIOS ? 44 : 20)
                    }}>Doctor Finder</Text>

                    <Text style={{fontSize: 24, fontWeight: 'bold',
                        color: Colors.lightBlack, marginTop: 30
                    }}>Sign in to your account</Text>

                    <TextInput
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        keyboardType = {'email-address'}
                        clearButtonMode={'while-editing'}
                        onChangeText={(text) => {
                            this.setState({account: text.trim() + ''})
                        }}
                        selectionColor = {Colors.theme}
                        value = {this.state.account}
                        underlineColorAndroid = {'transparent'}
                        numberOfLines={1}
                        placeholder = {'Email'}
                        placeholderTextColor={Colors.lightGray}
                        style={{width: ScreenDimensions.width - 40, marginTop: 40,
                            height: buttonHeight, textAlign: 'left', paddingLeft: 8, fontSize: 16,
                            color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
                            borderWidth: 1.0, borderColor: Colors.theme
                        }}/>

                    <TextInput
                        secureTextEntry={true}
                        clearButtonMode={'while-editing'}
                        onChangeText={(text) => {
                            this.setState({password: text.trim() + ''})
                        }}
                        selectionColor = {Colors.theme}
                        // value = {this.state.searchContent}
                        underlineColorAndroid = {'transparent'}
                        numberOfLines={1}
                        placeholder = {'Password'}
                        placeholderTextColor={Colors.lightGray}
                        style={{width: ScreenDimensions.width - 40, marginTop: 20,
                            height: buttonHeight, textAlign: 'left', paddingLeft: 8, fontSize: 16,
                            color: Colors.lightBlack, borderRadius: 4, backgroundColor: Colors.systemGray,
                            borderWidth: 1.0, borderColor: Colors.theme
                        }}/>

                    <TouchableOpacity onPress={() => {
                        this.pushToVerifyAccountPage()
                    }}  style={{
                        height: 30, justifyContent: 'center', alignItems: 'center',
                        marginTop: 8
                    }}>
                        <Text style={{fontSize: 16, color: Colors.theme,}}>{'Forgot password?'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.signIn()
                    }} style={{width: ScreenDimensions.width - 40,
                        height: buttonHeight, justifyContent: 'center', alignItems: 'center',
                        backgroundColor: Colors.theme, borderRadius: 4,
                        marginTop: 20
                    }}>
                        <Text style={{fontSize: 18, color: Colors.white, fontWeight: 'bold'}}>{'Sign in'}</Text>
                    </TouchableOpacity>

                    <Text style={{fontSize: 16, color: Colors.lightBlack, marginTop: 16}}>{'Are you new with Doc Finder?'}</Text>

                    <TouchableOpacity onPress={() => {
                        this.modalSignUpPage()
                    }} style={{
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

                <LoadingSpinner visible={this.state.isSpinnerVisible} />
            </TouchableOpacity>
        )
    }
}
