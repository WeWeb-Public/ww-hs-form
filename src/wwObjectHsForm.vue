<template>
    <div class="ww-hs-form">
        <div v-if="!portalId || !formId" class="empty">Clic to add hubspot code</div>
        <div :id="`form-${wwObject.uniqueId}`"></div>
    </div>
</template>
 

<script>			
import Vue from 'vue';
import { timeout } from 'q';
import { setTimeout } from 'timers';

export default {
    name: "__COMPONENT_NAME__",
    props: {
        wwObjectCtrl: Object,
        wwAttrs: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            reset: false,
            iframeComplete: false,
            portalId: null,
            formId: null
        }
    },
    computed: {
        wwObject() {
            return this.wwObjectCtrl.get();
        },
        editMode() {
            return this.wwObjectCtrl.getEditMode() == 'CONTENT'
        },
        source() {
            // return this.wwObject.content.data.source ? '<span></span>' + this.wwObject.content.data.source : null
        }
    },
    watch: {
    },
    methods: {
        async init() {

            const source = this.wwObject.content.data.source || ''

            const portalIdReg = /portalId\s*:\s*"([^"]*)"/gi
            let temp = portalIdReg.exec(source)
            if (temp && temp[1]) {
                this.portalId = temp[1]
                temp = null
            }

            const formIdReg = /formId\s*:\s*"([^"]*)"/gi
            temp = formIdReg.exec(source)
            if (temp && temp[1]) {
                this.formId = temp[1]
                temp = null
            }

            let lib = document.createElement('script');
            document.head.appendChild(lib);
            lib.onload = () => {
                hbspt.forms.create({
                    portalId: this.portalId,
                    formId: this.formId,
                    target: `#form-${this.wwObject.uniqueId}`
                });
            }
            lib.setAttribute('src', "//js.hsforms.net/forms/shell.js");
        },
        /* wwManager:start */
        async edit() {
            wwLib.wwObjectHover.setLock(this);
            let editList = {
                WWIFRAME_SOURCE: {
                    title: {
                        en: 'Add hubspot form code',
                        fr: 'Ajouter le code du formulaire hubspot'
                    },
                    desc: {
                        en: 'Copy Paste the code',
                        fr: 'Copier Coller le code'
                    },
                    icon: 'wwi wwi-config',
                    shortcut: 'c',
                    next: 'WWIFRAME_SOURCE'
                }
            }

            wwLib.wwPopups.addStory('WWIFRAME_EDIT', {
                title: {
                    en: 'Edit code',
                    fr: 'Editer le code '
                },
                type: 'wwPopupEditWwObject',
                buttons: null,
                storyData: {
                    list: editList
                }
            })

            wwLib.wwPopups.addStory('WWIFRAME_SOURCE', {
                title: {
                    en: 'Copy Paste the code',
                    fr: 'Copier Coller le code'
                },
                type: 'wwPopupForm',
                storyData: {
                    fields: [
                        {
                            label: {
                                en: 'Source :',
                                fr: 'Source'
                            },
                            type: 'textarea',
                            key: 'source',
                            valueData: 'source',
                            desc: {
                                en: 'Copy paste the code from hubspot',
                                fr: 'Copier / Coller le code fourni par hubspot'
                            },
                            style: {
                                height: '600px'
                            }
                        }
                    ]
                },
                buttons: {
                    NEXT: {
                        text: {
                            en: 'Finish',
                            fr: 'Terminer'
                        },
                        next: null
                    }
                }
            })

            let options = {
                firstPage: 'WWIFRAME_EDIT',
                data: {
                    wwObject: this.wwObject,
                    source: this.wwObject.content.data.source
                }
            }

            try {
                const result = await wwLib.wwPopups.open(options);
                console.log('RESULT : ', result)

                /*=============================================m_ÔÔ_m=============================================\
                  STYLE
                \================================================================================================*/
                if (typeof (result.source) != 'undefined') {
                    this.wwObject.content.data.source = result.source;
                    this.init()
                }

                this.wwObjectCtrl.update(this.wwObject);
                this.wwObjectCtrl.globalEdit(result);
                this.reinit()
            } catch (error) {
                console.log(error);
            }
            wwLib.wwObjectHover.removeLock();
        }
        /* wwManager:end */
    },
    mounted() {
        this.init();

        this.$emit('ww-loaded', this);
        window.addEventListener("resize", this.reinit)
    },
    beforeDestroyed() {
        window.removeEventListener("resize", this.reinit)
    }
};
</script>

<style lang="scss" scoped>
.ww-hs-form {
    .empty {
        width: 100%;
        background-color: #fafafa;
        color: grey;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>

