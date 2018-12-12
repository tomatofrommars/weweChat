
import React, { Component } from 'react';
import settings from '../../stores/settings';

import classes from './style.css';

export default class Header extends Component {
    getTitle() {
        switch (this.props.location.pathname) {
            case '/contacts':
                return '联系人 - WeWeChat  Clinks';

            case '/settings':
                return '设置 - WeWeChat  Clinks';

            default:
                return 'WeWeChat  Clinks';
        }
    }

    account(pms) {
        settings.setAccount(pms);
    }

    render() {
        return (
            <header className={classes.container}>
                <div>
                    <div className={classes.titleWrapper}>
                        <h1 className={classes.title}>{this.getTitle()}</h1>
                        &nbsp;&nbsp;
                        <input type="text" value={settings.account} placeholder=" 请输入 PMS 账号" onBlur={e => this.account(e.target.value)} />
                    </div>
                </div>
            </header>
        );
    }
}
