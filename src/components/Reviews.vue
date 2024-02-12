<script setup>
import Modal from './shared/Modal.vue';
import { QuillEditor } from '@vueup/vue-quill'
import { storeReview, removeReview, updateReview } from '../store/actions/review';
import { useAuthStore } from '../store/authStore';
import { storeToRefs } from "pinia"
import { useToast } from "vue-toastification";
import { ref, computed } from 'vue';
import { useEmploymentStore } from "../store/employmentStore";


const { isLoading, reviews } = storeToRefs(useEmploymentStore())
const toast = useToast();
const { id, isUser } = defineProps({
    id: Number,
    isUser: Boolean,
});
const { isAuthorized } = storeToRefs(useAuthStore())

const isShowDialog = ref(false)
const isShowMore = ref(false)
const isShowModal = ref(false)
const reviewId = ref(null)
const content = ref("");
const parentId = ref(null)
const vote = ref(0);
const isVote = ref(false);
const toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
]

function openDialog(text, max) {
    if (text?.length > max) {
        isShowDialog.value = true;
        content.value = text;
    }
};
function changeReview(item) {

    reviewId.value = item.id;
    vote.value = item.vote / 2;
    content.value = item.review;
    if (item.children) {
        isVote.value = true;
    } else {
        isVote.value = false;
    }
    isShowModal.value = true;
}

function createReview(id) {
    content.value = '';
    vote.value = 0;
    reviewId.value = null;
    if (id) {
        parentId.value = id;
        isVote.value = false;
    } else {
        isVote.value = true;
        parentId.value = null;
    }
    isShowModal.value = true;
}

function saveReview() {

    if (content.value?.trim() === '' && vote.value === 0) {
        toast.warning("The comment cannot be empty!");
        return
    }
    if (reviewId.value) {
        updateReview(id, isUser, reviewId.value, content.value, vote.value);
    } else {

        storeReview(id, isUser, content.value, vote.value, parentId.value)
    }

    isShowModal.value = false
}

function shotContent(text, max = 50) {
    if (text.length > max) {
        return text.substring(0, max) + "..."
    }
    return text;
}

const isLengthReviewsEnough = computed(() => {
    if (reviews.value?.length) {
        return reviews.value.length > 3
    }
    return false
})
const partOrFullReviews = computed(() => {
    if (!isLengthReviewsEnough.value) {
        isShowMore.value = false;
    }
    const arr = [...reviews.value]
    // console.log((isShowMore.value ? arr : arr.splice(0, 3)));
    return isShowMore.value ? arr : arr.splice(0, 3);
})

</script>

<template>
    <div v-if="reviews || isAuthorized">
        <div class="reviews_header">
            <v-card-title>Reviews</v-card-title>
            <v-btn v-if="isAuthorized" size="small" icon @click="createReview()" v-tooltip="'add review'">
                <span class="mdi mdi-plus reviews_btn-text"></span>
            </v-btn>
        </div>

        <ul class="reviews_list" v-if="reviews.length !== 0">
            <template v-for="review in partOrFullReviews">

                <li class=" reviews_item" @click="openDialog(review.review, 200)">
                    <div class="review_container">
                        <div class=" reviews_foto-box">
                            <img v-if="review?.owner.image" class="reviews_foto" width="60" height="60"
                                :src="review.owner.image" alt="foto">
                            <img v-if="!review?.owner.image" class="reviews_foto" width="60" height="60"
                                src="/src/assets/images/avatar_img.jpg" alt="foto">
                        </div>
                        <div class=" reviews_body">
                            <div class="reviews_item-header">
                                <span class=" reviews_name">{{ review.owner.name }}
                                    <v-rating half-increments :length="5" readonly :size="28" :model-value="review.vote / 2"
                                        color="warning" active-color="warning" />

                                </span>
                                <span class=" reviews_time">
                                    <v-btn v-if="isAuthorized" variant="text" @click="createReview(review.id)"
                                        v-tooltip="'Add'" class="btn_add">
                                        <span class="mdi mdi-plus reviews_btn-text"></span>
                                    </v-btn>
                                    <v-btn v-if="review.isOwner" variant="text" @click.stop="changeReview(review)"
                                        v-tooltip="'edit'">
                                        <span class="mdi mdi-fountain-pen-tip reviews_btn-text"></span>
                                    </v-btn>
                                    <v-btn v-if="review.isOwner" variant="text"
                                        @click.stop="removeReview(review.id, id, isUser)" v-tooltip="'remove'">
                                        <span class="mdi mdi-trash-can-outline reviews_btn-text"></span>
                                    </v-btn>{{ review.updated_at }}
                                </span>
                            </div>
                            <div v-if="review.review" :innerHTML="shotContent(review.review, 200)"> </div>
                        </div>
                    </div>
                </li>
                <template v-if="review.children && review.children.length">
                    <li v-for="review, i in review.children" class=" reviews_item reviews_item_child"
                        @click="openDialog(review.review, 200)">
                        <div class="review_container">
                            <div class=" reviews_foto-box">
                                <img v-if="review.owner.image" class="reviews_foto" width="60" height="60"
                                    :src="item.owner.image" alt="foto">
                                <img v-if="!review.owner.image" class="reviews_foto" width="60" height="60"
                                    src="/src/assets/images/avatar_img.jpg" alt="foto">
                            </div>
                            <div class=" reviews_body">
                                <div class="reviews_item-header">
                                    <span class=" reviews_name">
                                        {{ review.owner.name }}
                                    </span>
                                    <span class=" reviews_time">

                                        <v-btn v-if="review.isOwner" variant="text" @click.stop="changeReview(review)"
                                            v-tooltip="'edit'">
                                            <span class="mdi mdi-fountain-pen-tip reviews_btn-text"></span>
                                        </v-btn>
                                        <v-btn v-if="review.isOwner" variant="text"
                                            @click.stop="removeReview(review.id, id, isUser)" v-tooltip="'remove'">
                                            <span class="mdi mdi-trash-can-outline reviews_btn-text"></span>
                                        </v-btn>{{ review.updated_at }}
                                    </span>
                                </div>
                                <div v-if="review.review" :innerHTML="shotContent(review.review, 200)"> </div>
                            </div>
                        </div>
                    </li>
                </template>
            </template>
        </ul>

        <div class="reviews_control">
            <div>
                <v-btn v-if="!isShowMore && isLengthReviewsEnough" color="primary" block @click="isShowMore = true">Show all
                    comments</v-btn>
                <v-btn v-if="isShowMore && isLengthReviewsEnough" color="primary" block @click="isShowMore = false">Hide
                    comments</v-btn>
            </div>
        </div>

        <v-dialog v-model="isShowDialog" width="auto">
            <v-card>
                <v-card-text :innerHTML="content">

                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" block @click="isShowDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <Modal v-if="isShowModal" @close="isShowModal = false">

            <template v-slot:header>
                <div class="modal_header">
                    <h3>Comment editor </h3>
                    <v-rating v-if="isVote" half-increments hover :length="5" :size="28" color="warning"
                        active-color="warning" v-model="vote" />
                </div>

            </template>
            <template v-slot:body>
                <div class="modal_body">
                    <QuillEditor theme="snow" :toolbar="toolbar" v-model:content="content" contentType="html" />
                </div>
            </template>
            <template v-slot:footer="slotProps">
                <v-btn @click="saveReview">
                    save
                </v-btn>
                <v-btn @click="() => isShowModal = false">
                    {{ slotProps.btnCloseText }}
                </v-btn>
            </template>
        </Modal>
    </div>
</template>




<style lang="scss" scoped>
@import "../assets/scss/variables.scss";

.review_container {
    display: flex;
}

.reviews_btn-text {
    font-size: 25px;
}

.reviews_header {
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.reviews_title {
    margin-right: 20px;
}

.reviews_list {
    padding: 10px 20px;
}

.reviews_item {
    display: block;
    padding: 5px 10px;
    margin-bottom: 10px;
    border-color: #00000012;
    border-style: solid;
    border-width: 0;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}

.reviews_item_child {
    margin-left: 50px;
}

.reviews_control {
    display: flex;
    justify-content: center;
    margin-top: -10px;
    margin-bottom: 20px;
}

.reviews_item-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.reviews_body {
    width: 100%;
}

.reviews_time {
    font-size: small;
    font-style: italic;
}

.reviews_name {
    font-weight: 600;
    display: flex;
    align-items: center;
}

.reviews_foto {
    border-radius: 30px;
}

.reviews_foto-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
}

.modal_header {
    display: flex;
    justify-content: space-between;
}

.modal_body {
    width: 100%;
    margin-bottom: 40px;
    max-height: calc(70hv - 100px);
}

.modal-footer {
    display: flex;
    justify-content: space-evenly;
}
</style>