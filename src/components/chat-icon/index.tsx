import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReplyIcon from '@mui/icons-material/Reply';

interface Message {
  text: string;
  sender: 'user' | 'reply';
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isChatBoxOpen, setIsChatBoxOpen] = useState<boolean>(false);

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');

      // Giả lập phản hồi
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'This is a reply', sender: 'reply' },
        ]);
      }, 1000);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const toggleChatBox = () => {
    setIsChatBoxOpen(!isChatBoxOpen);
  };

  return (
    <Box>
      <IconButton
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#25D366',
          color: '#fff',
          borderRadius: '50%',
          padding: '10px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          '&:hover': {
            backgroundColor: '#128C7E',
          },
        }}
        onClick={toggleChatBox}
      >
        <WhatsAppIcon />
      </IconButton>

      {isChatBoxOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '350px',
            height: '500px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#fff',
            zIndex: 1000,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ccc',
              }}
            >
              <Typography variant="h6" sx={{
                padding: '10px',
              }}>AI Support</Typography>
              <IconButton onClick={toggleChatBox}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                padding: '10px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <List>
                {messages.map((message, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'center',
                    }}
                  >
                    <ListItemAvatar sx={{
                      minWidth: '40px',
                    }}>
                      <Avatar>
                        {message.sender === 'user' ? <AccountCircleIcon/> : <ReplyIcon/>}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={message.text}
                      sx={{
                        flexGrow: '1',
                        textAlign: message.sender === 'user' ? 'right' : 'left',
                        backgroundColor: message.sender === 'user' ? '#e1ffc7' : '#fff',
                        padding: '10px',
                        borderRadius: '10px',
                        marginLeft: message.sender === 'user' ? '0' : '10px',
                        marginRight: message.sender === 'user' ? '10px' : '0',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              sx={{
                display: 'flex',
                padding: '10px',
                borderTop: '1px solid #ccc',
              }}
            >
              <TextField
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type a message..."
                variant="outlined"
                size="small"
                fullWidth
                sx={{ marginRight: '10px' }}
              />
              <Button variant="contained" color="primary" type="submit">
                Send
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ChatBox;
