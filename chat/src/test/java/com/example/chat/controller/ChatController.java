package com.example.chat.controller;

import com.example.chat.chat.ChatMessage;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    
    //When the user types the username 
    @SuppressWarnings("null")
    @MessageMapping("/chat.registerUser")
    @SendTo("/topic/public")
    public ChatMessage register(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        chatMessage.setMessageType(ChatMessage.MessageType.JOIN);
        return chatMessage;
    }

    //When the user starts chatting 
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        @SuppressWarnings("null")
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        chatMessage.setSender(username);
        chatMessage.setMessageType(ChatMessage.MessageType.CHAT);
        return chatMessage;
    }

    
   
}

