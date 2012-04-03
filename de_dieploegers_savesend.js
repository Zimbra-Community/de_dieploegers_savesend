/*
    Document   : de_dieploegers_savesend.js
    Created on : 20120403
    Author     : Dennis Ploeger <develop@dieploegers.de>
    Description: Select a folder to save a sent message to
*/

function de_dieploegers_savesendHandlerObject() {
}

de_dieploegers_savesendHandlerObject.prototype = new ZmZimletBase();
de_dieploegers_savesendHandlerObject.prototype.constructor =
    de_dieploegers_savesendHandlerObject;

de_dieploegers_savesendHandlerObject.prototype.init =
    function () {

        this.folderButton = null;

    };

/**
 * Handle the click on "Select folder"
 *
 * @param ev DwtEvent of the click
 */

de_dieploegers_savesendHandlerObject.prototype.handleButtonClick =
    function (ev) {

        // Show folder selection

        this.chooseFolderDialog = appCtxt.getChooseFolderDialog();

        this.chooseFolderDialog.popup({

            treeIds: {
                sentFolder: [ ZmOrganizer.FOLDER ]
            },
            overviewId: this.chooseFolderDialog.getOverviewId(ZmApp.MAIL),
            title: this.getMessage("DIALOG_CHOOSEFOLDER_TITLE"),
            description: this.getMessage("DIALOG_CHOOSEFOLDER_DESCRIPTION"),
            skipRemote: false,
            skipReadOnly: true,
            noRootSelect: true

        });

        this.chooseFolderDialog.registerCallback(
            DwtDialog.OK_BUTTON,
            this.handleFolderSelected,
            this
        );

    };

/**
 * Handle the selection of a folder
 *
 * @param folder the selected ZmFolder
 */

de_dieploegers_savesendHandlerObject.prototype.handleFolderSelected =
    function (folder) {

        this.folderButton.setData(
            "SENTFOLDER",
            folder.id
        );

        this.folderButton.setText(
            AjxMessageFormat.format(
                this.getMessage("LABEL_FOLDER"),
                [
                    folder.getName()
                ]
            )
        );

        this.chooseFolderDialog.popdown();

    };

/**
 * Add the folder selection to the compose toolbar
 *
 * @param app        Current application
 * @param toolbar    Toolbar of view
 * @param controller Controller of view
 * @param viewId     ID of view
 */

de_dieploegers_savesendHandlerObject.prototype.initializeToolbar =
    function (
        app,
        toolbar,
        controller,
        viewId
    ) {

        // We're in compose-View

        if (viewId.indexOf(ZmId.VIEW_COMPOSE) === 0) {

            if (this.folderButton) {

                // Button has already been selected. Set back to sent

                this.folderButton.setText(
                    AjxMessageFormat.format(
                        this.getMessage("LABEL_FOLDER"),
                        [
                            appCtxt.getFolderTree().getById(
                                ZmFolder.ID_SENT
                            ).getName()
                        ]
                    )
                );

                this.folderButton.setData(
                    "SENTFOLDER",
                    ZmFolder.ID_SENT
                );

            } else {

                // Add folder selection button before the last button

                this.folderButton = toolbar.createButton(
                    "SentFolder",
                    {
                        image: "Folder",
                        index: toolbar.getChildren().length
                    }
                );

                this.folderButton.setText(
                    AjxMessageFormat.format(
                        this.getMessage("LABEL_FOLDER"),
                        [
                            appCtxt.getFolderTree().getById(
                                ZmFolder.ID_SENT
                            ).getName()
                        ]
                    )
                );

                this.folderButton.setData(
                    "SENTFOLDER",
                    ZmFolder.ID_SENT
                );

                this.folderButton.addSelectionListener(
                    new AjxListener(
                        this,
                        this.handleButtonClick
                    )
                );

            }

        }

    };

/**
 * Move message to folder
 *
 * @param message ZmMailMsg object of the sent mail
 */

de_dieploegers_savesendHandlerObject.prototype.onSendMsgSuccess =
    function (controller, message) {
        message.move(Number(this.folderButton.getData("SENTFOLDER")));
    };