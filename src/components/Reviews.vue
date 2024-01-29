<script setup>
import Modal from './shared/Modal.vue';
import { QuillEditor } from '@vueup/vue-quill'
import { storeReview } from '../store/actions/review';
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
const index = ref(null);
const isShowMore = ref(false)
const isShowModal = ref(false)
const curentReview = ref(null)
const content = ref("");
const vote = ref(0);
const toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
]

function openDialog(id, max) {
    if (reviews.value[id].review.length > max) {
        isShowDialog.value = true;
        index.value = id;
    }
};
function changeReview(i) {
    isShowModal.value = true;
    if (Number.isInteger(i)) {
        curentReview.value = reviews.value[i];
        content.value = reviews.value[i].review;
    } else {
        curentReview.value = null;
        content.value = '';
        vote.value = 0;
    }
}
function saveReview(e) {

    if (content.value?.trim() === '' && vote.value === 0) {
        toast.warning("The comment cannot be empty!");
        return
    }
    if (curentReview.value?.id) {
        console.log(id, type, curentReview.value?.id, content.value, vote.value, e.target.dataset?.reviewId);
    } else {
        console.log(e.target.dataset);
        storeReview(id, isUser, content.value, vote.value, e.target.dataset?.reviewId)
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
    return isShowMore.value ? arr : arr.splice(0, 3);
})

</script>

<template>
    <div v-if="reviews || isAuthorized">
        <div class="reviews_header">
            <v-card-title>Reviews</v-card-title>
            <v-btn v-if="isAuthorized" size="small" icon @click="changeReview()" v-tooltip="'add review'">
                <span class="mdi mdi-plus reviews_btn-text"></span>
            </v-btn>
        </div>

        <ul class="reviews_list" v-if="reviews">
            <li v-for="review, i in partOrFullReviews" class=" reviews_item" @click="openDialog(i, 200)">
                <div class=" reviews_foto-box">
                    <img v-if="review.owner.image" class="reviews_foto" width="60" height="60" :src="item.owner.image"
                        alt="foto">
                    <img v-if="!review.owner.image" class="reviews_foto" width="60" height="60"
                        src="/src/assets/images/avatar_img.jpg" alt="foto">
                </div>
                <div class=" reviews_body">
                    <div class="reviews_item-header">
                        <span class=" reviews_name">{{ review.owner.name }}
                            <v-rating half-increments :length="5" readonly :size="28" :model-value="review.vote / 2"
                                color="warning" active-color="warning" />

                        </span>
                        <span class=" reviews_time"> <v-btn v-if="isAuthorized" variant="text" :data-review-id="review.id"
                                @click="changeReview" v-tooltip="'add'">
                                <span class="mdi mdi-plus reviews_btn-text"></span>
                            </v-btn>
                            <v-btn v-if="review.isOwner" variant="text" @click.stop="changeReview(i)" v-tooltip="'edit'">
                                <span class="mdi mdi-fountain-pen-tip reviews_btn-text"></span>
                            </v-btn>
                            <v-btn v-if="review.isOwner" variant="text" @click.stop="reviews.removeReview(item.id, id)"
                                v-tooltip="'remove'">
                                <span class="mdi mdi-trash-can-outline reviews_btn-text"></span>
                            </v-btn>{{ review.updated_at
                            }}</span>
                    </div>
                    <div v-if="review.review" :innerHTML="shotContent(review.review, 200)"> </div>
                </div>

            </li>
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
                <v-card-text :innerHTML="reviewsItems[index].content">

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
                    <v-rating half-increments hover :length="5" :size="28" color="warning" active-color="warning"
                        v-model="vote" />
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
    display: flex;
    padding: 5px 10px;
    margin-bottom: 10px;
    border-color: #00000012;
    border-style: solid;
    border-width: 0;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
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