<template>
    <div class="ww-hs-form" :class="{ 'ww-editing': isEditing }">
        <!-- wwEditor:start -->
        <div v-if="!portalId || !formId" class="empty">Click to add HubSpot code</div>
        <!-- wwEditor:end -->
        <div :id="`form-${uid}`"></div>
    </div>
</template>

<script>
/* wwEditor:start */
import openPopup from './popups';
/* wwEditor:end */

export default {
    name: '__COMPONENT_NAME__',
    props: {
        uid: String,
        content: Object,
        /* wwEditor:start */
        wwEditorState: Object,
        /* wwEditor:end */
    },
    wwDefaultContent: {
        source: '',
    },
    data() {
        return {
            portalId: null,
            formId: null,
        };
    },
    computed: {
        isEditing() {
            return this.wwEditorState.editMode === wwLib.wwSectionHelper.EDIT_MODES.CONTENT;
        },
    },
    methods: {
        async init() {
            const source = this.content.source || '';

            const portalIdReg = /portalId\s*:\s*"([^"]*)"/gi;
            let temp = portalIdReg.exec(source);
            if (temp && temp[1]) this.portalId = temp[1];

            const formIdReg = /formId\s*:\s*"([^"]*)"/gi;
            temp = formIdReg.exec(source);
            if (temp && temp[1]) this.formId = temp[1];

            const lib = document.createElement('script');
            document.head.appendChild(lib);
            lib.onload = () => {
                hbspt.forms.create({
                    portalId: this.portalId,
                    formId: this.formId,
                    target: `#form-${this.uid}`,
                });
            };
            lib.setAttribute('src', '//js.hsforms.net/forms/shell.js');
        },
        /* wwEditor:start */
        async setOptions() {
            const result = await openPopup(this.content);
            if (result) this.$emit('update', result);
            this.$nextTick(() => this.init());
        },
        /* wwEditor:end */
    },
    mounted() {
        this.init();
    },
};
</script>

<style lang="scss" scoped>
.ww-hs-form {
    /* wwEditor:start */
    &.ww-editing {
        pointer-events: none;
    }
    .empty {
        width: 100%;
        background-color: #fafafa;
        color: grey;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    /* wwEditor:end */
}
</style>
