// src/App.js
import React, { useState, useEffect, useRef } from 'react';
/* eslint-disable jsx-a11y/anchor-has-content */

import {
  Box,
  TextField,
  Button,
  Typography,
  AppBar,
  Toolbar,
  CircularProgress,
  List,
  ListItem,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Fade,
  Slide
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Custom component for syntax highlighting
const CodeBlock = ({ children, className }) => {
  const language = className ? className.replace(/language-/, '') : 'text';
  return (
      <SyntaxHighlighter
          language={language}
          style={atomDark}
          showLineNumbers={false}
          wrapLines={true}
          customStyle={{
            borderRadius: '8px',
            padding: '16px',
            margin: '12px 0',
            fontSize: '0.9em'
          }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
  );
};

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(() => {
    // Load model from localStorage if available
    return localStorage.getItem('lastUsedModel') || 'meta-llama/llama-4-maverick:free';
  });
  const messagesEndRef = useRef(null);

  // Save selected model to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('lastUsedModel', selectedModel);
  }, [selectedModel]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const requestData = {
        model: selectedModel,
        messages: [...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: input }],
      };

      const requestConfig = {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'AI Chat App',
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          requestData,
          requestConfig
      );

      const aiMessage = {
        ...response.data.choices[0].message,
        timestamp: new Date().toISOString(),
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (message) => {
    if (message.errorData) {
      return (
          <Typography variant="body1" sx={{ color: '#ffffff' }}>
            {message.content}
          </Typography>
      );
    }

    return (
        <ReactMarkdown components={{
          code({node, inline, className, children, ...props}) {
            if (inline) {
              return <code style={{
                backgroundColor: 'rgba(110,118,129,0.4)',
                padding: '0.2em 0.4em',
                borderRadius: '4px',
                color: '#f0f0f0',
                fontSize: '0.9em'
              }} {...props}>{children}</code>;
            }
            return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
          },
          p: ({node, ...props}) => <Typography paragraph sx={{ color: '#e0e0e0', mb: 1.5, lineHeight: 1.6 }} {...props} />,
          a: ({node, ...props}) => <a style={{ color: '#58a6ff' }} {...props} />,
          h1: ({node, ...props}) => <Typography variant="h5" sx={{ color: '#ffffff', mt: 2, mb: 1.5 }} {...props} />,
          h2: ({node, ...props}) => <Typography variant="h6" sx={{ color: '#ffffff', mt: 2, mb: 1 }} {...props} />,
          blockquote: ({node, ...props}) => <blockquote style={{
            borderLeft: '4px solid #30363d',
            margin: '16px 0',
            paddingLeft: '16px',
            color: '#8b949e'
          }} {...props} />
        }}>{message.content}</ReactMarkdown>
    );
  };

  return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a1a 0%, #0a0a0a 100%)'
      }}>
        <AppBar position="static" elevation={0} sx={{
          backgroundColor: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <Toolbar sx={{ minHeight: '64px !important' }}>
            <Typography variant="h6" component="div" sx={{
              flexGrow: 1,
              fontWeight: '600',
              color: '#ffffff',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-0.5px'
            }}>
              Nexus<span style={{ color: '#6e48ff' }}>AI</span>
            </Typography>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel sx={{
                color: 'rgba(255,255,255,0.7)',
                fontFamily: '"Inter", sans-serif'
              }}>
                Model
              </InputLabel>
              <Select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  label="Model"
                  sx={{
                    color: '#ffffff',
                    fontFamily: '"Inter", sans-serif',
                    '.MuiSelect-icon': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    backgroundColor: 'rgba(255,255,255,0.05)'
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#1e1e1e',
                        color: '#ffffff',
                        '& .MuiMenuItem-root': {
                          fontFamily: '"Inter", sans-serif',
                          '&:hover': {
                            backgroundColor: 'rgba(110,72,255,0.2)'
                          }
                        }
                      }
                    }
                  }}
              >
                <MenuItem value="mistralai/mistral-7b-instruct:free">Mistral 7B</MenuItem>
                <MenuItem value="deepseek/deepseek-chat-v3-0324:free">Deepseek V3</MenuItem>
                <MenuItem value="google/gemini-2.0-flash-exp:free">Gemini Flash</MenuItem>
                <MenuItem value="meta-llama/llama-4-maverick:free">Llama 4</MenuItem>
              </Select>
            </FormControl>
          </Toolbar>
        </AppBar>

        <Box sx={{
          flexGrow: 1,
          overflow: 'auto',
          position: 'relative',
          backgroundImage: 'linear-gradient(rgba(10,10,10,0.9), rgba(10,10,10,0.9))'
        }}>
          {messages.length === 0 && (
              <Fade in={true} timeout={1000}>
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '600px',
                  px: 4
                }}>
                  <Typography variant="h4" sx={{
                    color: '#ffffff',
                    mb: 2,
                    fontWeight: '600',
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    Hi, how can I help you today?
                  </Typography>
                  <Typography variant="body1" sx={{
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.6,
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    Ask me anything, from creative ideas to technical explanations. I'm here to assist!
                  </Typography>
                </Box>
              </Fade>
          )}

          <List sx={{
            maxWidth: '800px',
            margin: '0 auto',
            py: 0,
            opacity: messages.length === 0 ? 0.3 : 1,
            transition: 'opacity 0.3s ease'
          }}>
            {messages.map((message, index) => (
                <Slide
                    key={message.id}
                    direction={message.role === 'user' ? 'left' : 'right'}
                    in={true}
                    mountOnEnter
                    unmountOnExit
                >
                  <Box>
                    <ListItem
                        sx={{
                          justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                          alignItems: 'flex-start',
                          py: 3,
                          px: 4,
                          backgroundColor: 'transparent',
                        }}
                    >
                      {message.role !== 'user' && (
                          <Avatar
                              sx={{
                                mr: 2,
                                background: 'linear-gradient(135deg, #6e48ff 0%, #9c4dff 100%)',
                                width: 40,
                                height: 40,
                                color: '#ffffff',
                                boxShadow: '0 4px 12px rgba(110,72,255,0.3)',
                              }}
                          >
                            AI
                          </Avatar>
                      )}
                      <Box
                          sx={{
                            flexGrow: 1,
                            color: '#ffffff',
                            '& p': { margin: '4px 0' },
                            '& pre': { margin: '12px 0' },
                            maxWidth: 'calc(100% - 56px)',
                          }}
                      >
                        <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 1.5,
                              color: message.role === 'user' ? '#ffffff' : 'rgba(255,255,255,0.7)',
                              fontWeight: '600',
                              fontFamily: '"Inter", sans-serif',
                            }}
                        >
                          {message.role === 'user' ? 'You' : 'Nexus AI'}
                        </Typography>
                        {renderMessageContent(message)}
                        <Typography
                            variant="caption"
                            display="block"
                            sx={{
                              mt: 1.5,
                              textAlign: 'right',
                              color: 'rgba(255,255,255,0.5)',
                              fontSize: '0.75rem',
                              fontFamily: '"Inter", sans-serif',
                            }}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </Box>
                      {message.role === 'user' && (
                          <Avatar
                              sx={{
                                ml: 2,
                                background: 'linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%)',
                                width: 40,
                                height: 40,
                                color: '#ffffff',
                              }}
                          >
                            U
                          </Avatar>
                      )}
                    </ListItem>
                    <Divider
                        sx={{
                          borderColor: 'rgba(255,255,255,0.08)',
                          my: 0,
                          mx: 4,
                        }}
                    />
                  </Box>
                </Slide>

            ))}
            {isLoading && (
                <ListItem sx={{
                  justifyContent: 'flex-start',
                  backgroundColor: 'transparent',
                  py: 3,
                  px: 4
                }}>
                  <Avatar sx={{
                    mr: 2,
                    background: 'linear-gradient(135deg, #6e48ff 0%, #9c4dff 100%)',
                    width: 40,
                    height: 40,
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(110,72,255,0.3)'
                  }}>
                    AI
                  </Avatar>
                  <CircularProgress
                      size={24}
                      thickness={4}
                      sx={{
                        color: '#6e48ff',
                        alignSelf: 'center'
                      }}
                  />
                </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        <Box component="form" autoComplete="off" onSubmit={handleSubmit} sx={{
          p: 3,
          backgroundColor: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <Box sx={{
            display: 'flex',
            gap: 1.5,
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <TextField
                fullWidth
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message NexusAI..."
                autoComplete="off"
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#ffffff',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6e48ff',
                    },
                    '& input::placeholder': {
                      color: 'rgba(255,255,255,0.5)',
                      opacity: 1,
                      fontFamily: '"Inter", sans-serif'
                    }
                  },
                }}
                inputProps={{
                  style: {
                    color: '#ffffff',
                    padding: '14px 16px',
                    fontFamily: '"Inter", sans-serif'
                  }
                }}
            />
            <Button
                type="submit"
                variant="contained"
                disabled={!input.trim() || isLoading}
                sx={{
                  minWidth: '56px',
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6e48ff 0%, #9c4dff 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(110,72,255,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5d3be8 0%, #8c42e8 100%)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    background: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.3)'
                  },
                  transition: 'all 0.2s ease'
                }}
            >
              <SendIcon />
            </Button>
          </Box>
          <Typography variant="caption" sx={{
            display: 'block',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.4)',
            mt: 1.5,
            fontSize: '0.75rem',
            fontFamily: '"Inter", sans-serif'
          }}>
            NexusAI may produce inaccurate information. Consider verifying important facts.
          </Typography>
        </Box>
      </Box>
  );
}

export default App;