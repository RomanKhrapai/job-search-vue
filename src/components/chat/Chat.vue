<template>
    <v-app>
        <v-container fluid>
            <v-row>

                <v-col cols="4">
                    <v-card>
                        <v-card-title>Chats</v-card-title>
                        <ul>
                            <li v-for="chat in chatsList" :key="chat.id" @click="setCurrentChat(chat)"
                                class="chat_user_box">

                                <div class=" chat_foto-box">
                                    <img v-if="chat.interlocutorImage" class="chat_foto" width="40" height="40"
                                        :src="chat.interlocutorImage" alt="User avatar" />
                                    <img v-if="!chat.interlocutorImage" class="chat_foto" width="40" height="40"
                                        src="/src/assets/images/avatar_img.jpg" alt="User avatar" />
                                </div>
                                <v-list-item-title>{{ chat.interlocutorName }}</v-list-item-title>

                            </li>
                        </ul>
                    </v-card>
                </v-col>


                <v-col cols="8">
                    <v-card v-if="currentChat">
                        <v-card-title>
                            Chat with {{ currentChat.interlocutorName }}
                        </v-card-title>
                        <ul class="messages_list" v-if="messages">
                            <template v-for="message, i in messages">
                                <li class=" messages_item">
                                    <div v-if="message.isOwner" class="messages_container">

                                        <div class=" messages_body">
                                            <div class="messages_item-header">
                                                <span class=" messages_name">you </span>
                                                <span class=" messages_time">{{ message.date }}</span>
                                            </div>
                                            <div> {{ message.content }}</div>
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
                                                <span class=" messages_name">{{ currentChat.interlocutorName }} </span>
                                                <span class=" messages_time">{{ message?.date }}</span>
                                            </div>
                                            <div> {{ message.content }}</div>
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
import { ref } from 'vue';

const { getChatsList, setCurrentChat, sendMessage } = useChatsStore()
const { chatsList, currentChat, messages } = storeToRefs(useChatsStore());

const newMessage = ref('');

const sendMessageSubmit = () => {
    if (newMessage.value.trim() !== '') {
        sendMessage(newMessage.value);
        newMessage.value = '';
    }
};

getChatsList();
</script>


<style lang="scss" scoped>
@import "./style.module.scss";
</style>