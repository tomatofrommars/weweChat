
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { remote } from 'electron';
import clazz from 'classname';
import moment from 'moment';

import classes from './style.css';
import helper from 'utils/helper';

moment.updateLocale('en', {
    relativeTime: {
        past: '%s',
        m: '1 min',
        mm: '%d mins',
        h: 'an hour',
        hh: '%d h',
        s: 'now',
        ss: '%d s',
    },
});

@inject(stores => ({
    chats: stores.chat.sessions,
    chatTo: stores.chat.chatTo,
    selected: stores.chat.user,
    messages: stores.chat.messages,
    markedRead: stores.chat.markedRead,
    sticky: stores.chat.sticky,
    warehouse: stores.chat.warehouse,
    removeChat: stores.chat.removeChat,
    loading: stores.session.loading,
    searching: stores.search.searching,
}))
@observer
export default class Chats extends Component {
    getTheLastestMessage(userid) {
        var list = this.props.messages.get(userid);
        var res;

        if (list) {
            // Make sure all chatset has be loaded
            res = list.data.slice(-1)[0];
        }

        return res;
    }

    hasUnreadMessage(userid) {
        var list = this.props.messages.get(userid);

        if (list) {
            return list.data.length !== (list.unread || 0);
        }
    }

    showContextMenu(user) {
        const menus = [];
        menus.push({
            label: '发送消息',
            click: () => {
                this.props.chatTo(user);
            }
        });
        if (helper.isChatRoom(user.UserName)) {
            menus.push({
                type: 'separator'
            });
            if (user.Toodc) {
                menus.push({
                    label: '取消收集',
                    click: () => {
                        this.props.warehouse(user, false);
                    }
                });
            } else {
                menus.push({
                    label: '收集仓库信息',
                    click: () => {
                        this.props.warehouse(user, true);
                    }
                });
            }
        }
        menus.push({
            type: 'separator'
        });
        menus.push({
            label: helper.isTop(user) ? '取消置顶' : '置顶',
            click: () => {
                this.props.sticky(user);
            }
        });
        menus.push({
            label: '删除',
            click: () => {
                this.props.removeChat(user);
            }
        });
        menus.push({
            label: '标记已读',
            click: () => {
                this.props.markedRead(user.UserName);
            }
        });
        var menu = new remote.Menu.buildFromTemplate(menus);
        menu.popup(remote.getCurrentWindow());
    }

    componentDidUpdate() {
        var container = this.refs.container;
        var active = container.querySelector(`.${classes.chat}.${classes.active}`);

        if (active) {
            let rect4active = active.getBoundingClientRect();
            let rect4viewport = container.getBoundingClientRect();

            // Keep the conversation always in the viewport
            if (!(rect4active.top >= rect4viewport.top
                && rect4active.bottom <= rect4viewport.bottom)) {
                active.scrollIntoViewIfNeeded();
            }
        }
    }

    render() {
        var { loading, chats, selected, chatTo, searching } = this.props;

        if (loading) return false;

        return (
            <div className={classes.container}>
                <div
                    className={classes.chats}
                    ref="container">
                    {
                        !searching && chats.map((e, index) => {
                            var message = this.getTheLastestMessage(e.UserName) || {};
                            var muted = helper.isMuted(e);
                            var isTop = helper.isTop(e);

                            return (
                                <div
                                    className={clazz(classes.chat, {
                                        [classes.sticky]: isTop,
                                        [classes.active]: selected && selected.UserName === e.UserName
                                    })}
                                    key={index}
                                    onContextMenu={ev => this.showContextMenu(e)}
                                    onClick={ev => chatTo(e)}>
                                    <div className={classes.inner}>
                                        <div className={clazz(classes.dot, {
                                            [classes.green]: !muted && this.hasUnreadMessage(e.UserName),
                                            [classes.red]: muted && this.hasUnreadMessage(e.UserName)
                                        })}>
                                            <img
                                                className="disabledDrag"
                                                src={e.HeadImgUrl}
                                                onError={e => (e.target.src = 'assets/images/user-fallback.png')}
                                            />
                                        </div>

                                        <div className={classes.info}>
                                            <p
                                                className={classes.username}
                                                dangerouslySetInnerHTML={{__html: e.RemarkName || e.NickName}} />
                                            <span className={classes.message}>
                                                <span
                                                    className={classes.toodc}
                                                    dangerouslySetInnerHTML={{__html: e.Toodc ? '收集中... ' : ''}} />
                                                {
                                                    helper.getMessageContent(message) || ''
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <span className={classes.times}>
                                        {
                                            message.CreateTime ? moment(message.CreateTime * 1000).fromNow() : ''
                                        }
                                    </span>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}
