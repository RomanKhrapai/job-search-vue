<template>
    <v-app>
        <v-container fluid>
            <v-row>

                <v-col cols="4">
                    <v-card>
                        <v-card-title>Chats</v-card-title>
                        <ul v-if="role === 3" class="chats_list">
                            <li v-for="chat in chatsList" :key="chat.id" @click="setCurrentChat(chat)"
                                class="chat_user_box">

                                <div class=" chat_foto-box">
                                    <img v-if="chat.interlocutorImage" class="chat_foto" width="40" height="40"
                                        :src="chat.interlocutorImage" alt="User avatar" />
                                    <img v-if="!chat.interlocutorImage" class="chat_foto" width="40" height="40"
                                        src="/src/assets/images/avatar_img.jpg" alt="User avatar" />
                                </div>
                                <v-list-item-title>
                                    <v-icon v-if="chat.read" size="small" icon="mdi-read" color="blue darken-2"></v-icon>
                                    {{ chat.interlocutorName }}
                                </v-list-item-title>

                            </li>
                        </ul>
                        <div v-else class="chats_list">
                            <div class="drop-down_menu">

                                <div class="dropdown relative" v-for="company, i in chatsList.reduce((acc, obj) => {
                                    const key = obj.companyId;
                                    if (!acc[key]) acc[key] = [];
                                    acc[key].push(obj);
                                    return acc;
                                }, {})">
                                    <div class="drop-down_title" @click="show[i] = !show[i]">
                                        <div class=" chat_foto-box">
                                            <img v-if="company[0].yourImage" class="chat_foto" width="40" height="40"
                                                :src="company[0].yourImage" alt="User avatar" />
                                            <img v-if="!company[0].yourImage" class="chat_foto" width="40" height="40"
                                                src="/src/assets/images/avatar_img.jpg" alt="User avatar" />
                                        </div>
                                        <v-list-item-title>
                                            <v-icon v-if="company.find(item => item.read == true)" size="small"
                                                icon="mdi-read" color="blue darken-2"></v-icon>
                                            {{ company[0].yourName }}
                                        </v-list-item-title>
                                    </div>
                                    <template v-if="show[i]">
                                        <div v-for=" chat  in  company " :key="chat.id" @click="setCurrentChat(chat)"
                                            class="chat_user_box">
                                            <div class=" chat_foto-box">
                                                <img v-if="chat.interlocutorImage" class="chat_foto" width="40" height="40"
                                                    :src="chat.interlocutorImage" alt="User avatar" />
                                                <img v-if="!chat.interlocutorImage" class="chat_foto" width="40" height="40"
                                                    src="/src/assets/images/avatar_img.jpg" alt="User avatar" />
                                            </div>
                                            <v-list-item-title>
                                                <v-icon v-if="chat.read" size="small" icon="mdi-read"
                                                    color="blue darken-2"></v-icon>
                                                {{ chat.interlocutorName }}
                                            </v-list-item-title>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </v-col>


                <v-col cols="8">
                    <v-card v-if="currentChat">
                        <v-card-title>
                            Chat with {{ currentChat.interlocutorName }}
                        </v-card-title>
                        <ul class="messages_list" v-if="messages" ref="scrollMessages">
                            <template v-for=" message, i  in  messages ">
                                <li class=" messages_item">
                                    <div v-if="message.isOwner" class="messages_container">

                                        <div class=" messages_body">
                                            <div class="messages_item-header">

                                                <span class=" messages_name">
                                                    <v-icon v-if="message.read" size="small" icon="mdi-read"
                                                        color="blue darken-2"></v-icon>
                                                    you: {{ currentChat.yourName }}
                                                </span>
                                                <span class=" messages_time">{{ message.date }}</span>
                                            </div>
                                            <div v-html="message.content"> </div>
                                        </div>
                                        <div class=" messages_foto-box">
                                            <img v-if="currentChat.yourImage" class="messages_foto" width="60" height="60"
                                                :src="currentChat.yourImage" alt="foto">
                                            <img v-if="!currentChat.yourImage" class="messages_foto" width="60" height="60"
                                                src="/src/assets/images/avatar_img.jpg" alt="foto">
                                        </div>
                                    </div>
                                    <div v-else class="messages_container">

                                        <div class=" messages_foto-box">
                                            <img v-if="currentChat.interlocutorImage" class="messages_foto" width="60"
                                                height="60" :src="currentChat.interlocutorImage" alt="foto">
                                            <img v-if="!currentChat.interlocutorImage" class="messages_foto" width="60"
                                                height="60" src="/src/assets/images/avatar_img.jpg" alt="foto">
                                        </div>
                                        <div class=" messages_body">
                                            <div class="messages_item-header">
                                                <span class=" messages_name">
                                                    <v-icon v-if="message.read" size="small" icon="mdi-read"
                                                        color="blue darken-2"></v-icon>
                                                    {{ currentChat.interlocutorName }}
                                                </span>
                                                <span class=" messages_time">{{ message?.date }}</span>
                                            </div>
                                            <div v-html="message.content"> </div>
                                        </div>
                                    </div>

                                </li>
                            </template>
                        </ul>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-text-field v-model="newMessage" label="Enter a message..." outlined></v-text-field>
                            <v-btn @click="sendMessageSubmit" color="primary">Send</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>
  
<script setup>
import { useChatsStore } from '../../store/chatsStore';
import { storeToRefs } from 'pinia';
import { ref, watch, onMounted } from 'vue';
import { useAuthStore } from '../../store/authStore';

const { companies, role } = storeToRefs(useAuthStore());
const { getChatsList, setCurrentChat, sendMessage } = useChatsStore()
const { chatsList, currentChat, messages } = storeToRefs(useChatsStore());

const newMessage = ref('');
const scrollMessages = ref(null)
const show = ref([]);

function sendMessageSubmit() {

    if (newMessage.value.trim() !== '') {
        sendMessage(newMessage.value);
        newMessage.value = '';
    }
};

function scrolEnd() {
    if (scrollMessages.value) {
        scrollMessages.value.scrollTop = scrollMessages.value.scrollHeight;
    }
}

watch(messages, (newVal) => {
    setTimeout(() => {
        scrolEnd();
    }, 0);
})

getChatsList();
</script>


<style lang="scss" scoped>
@import "./style.module.scss";
</style>