import './stories';

export default async function openPopup(content) {
    try {
        const options = {
            firstPage: 'WW_HS_FORM_SOURCE',
            data: { ...content },
        };

        return await wwLib.wwPopups.open(options);
    } catch (err) {
        wwLib.wwLog.error(err);
        return null;
    }
}
