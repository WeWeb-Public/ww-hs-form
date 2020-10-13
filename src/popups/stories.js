wwLib.wwPopups.addStory('WW_HS_FORM_SOURCE', {
    title: {
        en: 'Copy Paste the code',
        fr: 'Copier Coller le code',
    },
    type: 'wwPopupForm',
    storyData: {
        fields: [
            {
                label: {
                    en: 'Source :',
                    fr: 'Source:',
                },
                type: 'textarea',
                key: 'source',
                valueData: 'source',
                desc: {
                    en: 'Copy paste the code from hubspot',
                    fr: 'Copier / Coller le code fourni par hubspot',
                },
                style: {
                    height: '600px',
                },
            },
        ],
    },
    buttons: {
        NEXT: {
            text: {
                en: 'Finish',
                fr: 'Terminer',
            },
            next: null,
        },
    },
});
