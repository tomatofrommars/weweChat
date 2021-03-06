
import { observable, action } from 'mobx';
import { remote, ipcRenderer } from 'electron';

import storage from 'utils/storage';
import helper from 'utils/helper';

class Settings {
    @observable alwaysOnTop = false;
    @observable showOnTray = true;
    @observable showNotification = true;
    @observable confirmImagePaste = true;
    @observable startup = false;
    @observable blockRecall = false;
    @observable rememberConversation = false;
    @observable showRedIcon = true;
    @observable downloads = '';
    @observable listenUsers = [];
    @observable account = '0';

    @action setAlwaysOnTop(alwaysOnTop) {
        self.alwaysOnTop = alwaysOnTop;
        self.save();
    }

    @action setShowRedIcon(showRedIcon) {
        self.showRedIcon = showRedIcon;
        self.save();
    }

    @action setRememberConversation(rememberConversation) {
        self.rememberConversation = rememberConversation;
        self.save();
    }

    @action setBlockRecall(blockRecall) {
        self.blockRecall = blockRecall;
        self.save();
    }

    @action setShowOnTray(showOnTray) {
        self.showOnTray = showOnTray;
        self.save();
    }

    @action setListenUsers(listenUsers) {
        self.listenUsers = listenUsers;
        self.save();
    }

    @action setAccount(account) {
        self.account = account;
        self.save();
    }

    @action setConfirmImagePaste(confirmImagePaste) {
        self.confirmImagePaste = confirmImagePaste;
        self.save();
    }

    @action setShowNotification(showNotification) {
        self.showNotification = showNotification;
        self.save();
    }

    @action setStartup(startup) {
        self.startup = startup;
        self.save();
    }

    @action setDownloads(downloads) {
        self.downloads = downloads.path;
        self.save();
    }

    @action async init() {
        var settings = await storage.get('settings');
        var { alwaysOnTop, showOnTray, listenUsers, account, showNotification, blockRecall, rememberConversation, showRedIcon, startup, downloads } = self;

        if (settings && Object.keys(settings).length) {
            // Use !! force convert to a bool value
            self.alwaysOnTop = !!settings.alwaysOnTop;
            self.showOnTray = !!settings.showOnTray;
            self.listenUsers = settings.listenUsers || [];
            self.account = settings.account || '0';
            self.showNotification = !!settings.showNotification;
            self.confirmImagePaste = !!settings.confirmImagePaste;
            self.startup = !!settings.startup;
            self.blockRecall = !!settings.blockRecall;
            self.rememberConversation = !!settings.rememberConversation;
            self.showRedIcon = !!settings.showRedIcon;
            self.downloads = settings.downloads;
        } else {
            await storage.set('settings', {
                alwaysOnTop,
                showOnTray,
                listenUsers,
                showNotification,
                startup,
                downloads,
                account,
                blockRecall,
                rememberConversation,
                showRedIcon,
            });
        }

        // Alway show the tray icon on windows
        if (!helper.isOsx) {
            self.showOnTray = true;
        }

        if (!self.downloads
            || typeof self.downloads !== 'string') {
            self.downloads = remote.app.getPath('downloads');
        }

        self.save();
        return settings;
    }

    save() {
        var { alwaysOnTop, showOnTray, listenUsers, showNotification, confirmImagePaste, blockRecall, rememberConversation, showRedIcon, startup, downloads, account } = self;

        storage.set('settings', {
            alwaysOnTop,
            showOnTray,
            listenUsers,
            showNotification,
            confirmImagePaste,
            startup,
            downloads,
            account,
            blockRecall,
            rememberConversation,
            showRedIcon,
        });

        ipcRenderer.send('settings-apply', {
            settings: {
                alwaysOnTop,
                showOnTray,
                listenUsers,
                showNotification,
                confirmImagePaste,
                startup,
                downloads,
                account,
                blockRecall,
                rememberConversation,
                showRedIcon,
            }
        });
    }
}

const self = new Settings();
export default self;
