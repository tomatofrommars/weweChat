
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import classes from './style.css';
import Switch from 'components/Switch';
import Avatar from 'components/Avatar';
import helper from 'utils/helper';

@inject(stores => ({
    alwaysOnTop: stores.settings.alwaysOnTop,
    setAlwaysOnTop: stores.settings.setAlwaysOnTop,
    showOnTray: stores.settings.showOnTray,
    setShowOnTray: stores.settings.setShowOnTray,
    showNotification: stores.settings.showNotification,
    setShowNotification: stores.settings.setShowNotification,
    startup: stores.settings.startup,
    setStartup: stores.settings.setStartup,
    downloads: stores.settings.downloads,
    setDownloads: stores.settings.setDownloads,
    confirmImagePaste: stores.settings.confirmImagePaste,
    setConfirmImagePaste: stores.settings.setConfirmImagePaste,
    blockRecall: stores.settings.blockRecall,
    setBlockRecall: stores.settings.setBlockRecall,
    rememberConversation: stores.settings.rememberConversation,
    setRememberConversation: stores.settings.setRememberConversation,
    showRedIcon: stores.settings.showRedIcon,
    setShowRedIcon: stores.settings.setShowRedIcon,

    user: stores.session.user,
    logout: stores.session.logout,
}))
@observer
export default class Settings extends Component {
    choiceDownloadDir() {
        this.refs.downloads.click();
    }

    componentDidMount() {
        this.refs.downloads.webkitdirectory = true;
    }

    render() {
        var {
            alwaysOnTop,
            setAlwaysOnTop,
            showOnTray,
            setShowOnTray,
            showNotification,
            setShowNotification,
            startup,
            setStartup,
            downloads,
            setDownloads,
            confirmImagePaste,
            setConfirmImagePaste,
            blockRecall,
            setBlockRecall,
            rememberConversation,
            setRememberConversation,
            showRedIcon,
            setShowRedIcon,
            user,
        } = this.props;

        return (
            <div className={classes.container}>
                <div className={classes.column}>
                    <h2>Settings</h2>

                    <ul>
                        {
                            user && (
                                <li className={classes.user}>
                                    <Avatar src={this.props.user.User.HeadImgUrl} />
                                    <button onClick={e => this.props.logout()}>Logout</button>
                                </li>
                            )
                        }
                        <li className={classes.downloads}>
                            <div>
                                <input
                                    onChange={e => setDownloads(e.target.files[0])}
                                    ref="downloads"
                                    type="file" />
                                <p>下载目录</p>
                                <p onClick={e => this.choiceDownloadDir()}>{downloads}</p>
                            </div>

                            <button onClick={e => this.choiceDownloadDir()}>Change</button>
                        </li>
                        <li>
                            <label htmlFor="alwaysOnTop">
                                <span>保持在前</span>
                                <Switch
                                    checked={alwaysOnTop}
                                    id="alwaysOnTop"
                                    onChange={e => setAlwaysOnTop(e.target.checked)} />
                            </label>
                        </li>

                        <li>
                            <label htmlFor="showOnTray">
                                <span>显示到状态栏</span>
                                <Switch
                                    checked={showOnTray}
                                    disabled={!helper.isOsx}
                                    id="showOnTray"
                                    onChange={e => setShowOnTray(e.target.checked)} />
                            </label>
                        </li>

                        <li>
                            <label htmlFor="showNotification">
                                <span>打开通知</span>
                                <Switch
                                    checked={showNotification}
                                    id="showNotification"
                                    onChange={e => setShowNotification(e.target.checked)} />
                            </label>
                        </li>

                        <li>
                            <label htmlFor="blockRecall">
                                <span>拦截撤回消息</span>
                                <Switch
                                    checked={blockRecall}
                                    id="blockRecall"
                                    onChange={e => setBlockRecall(e.target.checked)} />
                            </label>
                        </li>

                        <li>
                            <label htmlFor="rememberConversation">
                                <span>记住上次通话</span>
                                <Switch
                                    checked={rememberConversation}
                                    id="rememberConversation"
                                    onChange={e => setRememberConversation(e.target.checked)} />
                            </label>
                        </li>

                        <li>
                            <label htmlFor="showRedIcon">
                                <span>显示红色按钮</span>
                                <Switch
                                    checked={showRedIcon}
                                    id="showRedIcon"
                                    onChange={e => setShowRedIcon(e.target.checked)} />
                            </label>
                        </li>

                        <li>
                            <label htmlFor="confirmImagePaste">
                                <span>图片粘贴确认</span>
                                <Switch
                                    checked={confirmImagePaste}
                                    id="confirmImagePaste"
                                    onChange={e => setConfirmImagePaste(e.target.checked)} />
                            </label>
                        </li>

                        <li>
                            <label htmlFor="startup">
                                <span>开机启动</span>
                                <Switch
                                    checked={startup}
                                    id="startup"
                                    onChange={e => setStartup(e.target.checked)} />
                            </label>
                        </li>
                    </ul>
                </div>
                <div className={classes.column}>
                    <h2>TODO:</h2>
                </div>
            </div>
        );
    }
}
