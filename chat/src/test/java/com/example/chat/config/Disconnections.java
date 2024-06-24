//When the user leaves the chatroom

package com.example.chat.config;

import com.example.chat.chat.ChatMessage;
import com.example.chat.chat.ChatMessage.MessageType;

import lombok.*;


import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@Slf4j
@RequiredArgsConstructor
public class Disconnections{
    private final SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleDisconnections(SessionDisconnectEvent event){

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
   
        //this if statement checks the type, the name of the sender 
        @SuppressWarnings("null")
        String username= (String) headerAccessor.getSessionAttributes().get("username");
        if(username != null){
            log.info("user disconnected: {}", username);
            var chatMessage = ChatMessage.builder()
                    .messageType(MessageType.LEAVE)
                    .sender(username)
                    .build();
            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}