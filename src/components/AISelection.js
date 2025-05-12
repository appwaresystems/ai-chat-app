// src/components/AISelection.js
import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Avatar,
    Divider,
    Fade,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';

const aiList = [
    {
        id: 'meta-llama/llama-4-maverick:free',
        name: 'Llama 4 Maverick',
        description: 'Latest Llama model with enhanced reasoning and coding capabilities',
        avatarColor: 'linear-gradient(135deg, #FF7D45 0%, #F02E65 100%)',
        pattern: 'url(#diagonalHatches)',
        tech: 'Meta AI'
    },
    {
        id: 'mistralai/mistral-7b-instruct:free',
        name: 'Mistral 7B',
        description: 'Efficient and powerful model for general instructions',
        avatarColor: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
        pattern: 'url(#dots)',
        tech: 'Mistral AI'
    },
    {
        id: 'deepseek/deepseek-chat-v3-0324:free',
        name: 'Deepseek V3',
        description: 'Specialized in technical and coding assistance',
        avatarColor: 'linear-gradient(135deg, #00C6FB 0%, #005BEA 100%)',
        pattern: 'url(#crosses)',
        tech: 'Deepseek'
    },
    {
        id: 'google/gemini-2.0-flash-exp:free',
        name: 'Gemini Flash',
        description: 'Fast and versatile model from Google',
        avatarColor: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
        pattern: 'url(#waves)',
        tech: 'Google AI'
    }
];

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

function AISelection({ onSelectAI }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'radial-gradient(circle at 10% 20%, rgba(15, 15, 25, 0.95) 0%, rgba(5, 5, 15, 1) 90%)',
                py: 8,
                px: isMobile ? 2 : 4,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Decorative elements */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.15,
                background: `radial-gradient(circle at 70% 30%, ${theme.palette.primary.main} 0%, transparent 70%)`
            }} />

            {/* SVG Patterns */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <pattern id="diagonalHatches" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="10" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
                    </pattern>
                    <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
                        <circle cx="3" cy="3" r="1" fill="#ffffff" opacity="0.3" />
                    </pattern>
                    <pattern id="crosses" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M0,0 L8,8 M8,0 L0,8" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
                    </pattern>
                    <pattern id="waves" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M0,10 Q5,5 10,10 T20,10" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.3" />
                    </pattern>
                </defs>
            </svg>

            <Fade in={true} timeout={800}>
                <Box sx={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h2" sx={{
                            color: 'transparent',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(200,200,255,0.8) 100%)',
                            backgroundClip: 'text',
                            mb: 2,
                            fontWeight: '800',
                            fontFamily: '"Inter", sans-serif',
                            textAlign: 'center',
                            fontSize: isMobile ? '2.5rem' : '3.5rem',
                            lineHeight: 1.2
                        }}>
                            Choose Your AI Companion
                        </Typography>
                        <Typography variant="subtitle1" sx={{
                            color: 'rgba(255,255,255,0.7)',
                            mb: 6,
                            fontWeight: '400',
                            fontFamily: '"Inter", sans-serif',
                            textAlign: 'center',
                            maxWidth: '700px',
                            margin: '0 auto',
                            fontSize: isMobile ? '1rem' : '1.1rem'
                        }}>
                            Select from our curated collection of advanced AI assistants, each with unique capabilities tailored to your needs.
                        </Typography>
                    </motion.div>

                    <Grid container spacing={isMobile ? 3 : 4} justifyContent="center">
                        {aiList.map((ai, index) => (
                            <Grid item xs={12} sm={6} lg={3} key={ai.id}>
                                <motion.div
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card sx={{
                                        height: '100%',
                                        background: `linear-gradient(180deg, rgba(30,30,40,0.7) 0%, rgba(20,20,30,0.9) 100%)`,
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '20px',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        '&:before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: ai.avatarColor
                                        },
                                        '&:after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            width: '100px',
                                            height: '100px',
                                            background: ai.pattern,
                                            opacity: 0.1
                                        }
                                    }}>
                                        <CardActionArea
                                            onClick={() => onSelectAI(ai.id)}
                                            sx={{
                                                height: '100%',
                                                '&:hover .ai-avatar': {
                                                    transform: 'scale(1.1)',
                                                    boxShadow: `0 0 20px ${ai.avatarColor.split(',')[1]}`
                                                }
                                            }}
                                        >
                                            <CardContent sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                p: 4,
                                                height: '100%'
                                            }}>
                                                <Avatar
                                                    className="ai-avatar"
                                                    sx={{
                                                        width: 100,
                                                        height: 100,
                                                        mb: 3,
                                                        background: ai.avatarColor,
                                                        fontSize: '2.5rem',
                                                        fontWeight: '700',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                                        '&:before': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            inset: 0,
                                                            borderRadius: '50%',
                                                            padding: '2px',
                                                            background: ai.avatarColor,
                                                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                                            WebkitMaskComposite: 'xor',
                                                            maskComposite: 'exclude',
                                                            pointerEvents: 'none'
                                                        }
                                                    }}
                                                >
                                                    {ai.name.charAt(0)}
                                                </Avatar>
                                                <Typography variant="h5" sx={{
                                                    color: '#ffffff',
                                                    mb: 1,
                                                    fontWeight: '700',
                                                    fontFamily: '"Inter", sans-serif',
                                                    textAlign: 'center',
                                                    fontSize: '1.5rem'
                                                }}>
                                                    {ai.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{
                                                    color: 'rgba(255,255,255,0.6)',
                                                    mb: 2,
                                                    fontWeight: '500',
                                                    fontFamily: '"Inter", sans-serif',
                                                    textAlign: 'center'
                                                }}>
                                                    {ai.tech}
                                                </Typography>
                                                <Divider sx={{
                                                    width: '50%',
                                                    borderColor: 'rgba(255,255,255,0.15)',
                                                    my: 2,
                                                    height: '1px',
                                                    background: `linear-gradient(90deg, transparent, ${ai.avatarColor.split(',')[1]}, transparent)`,
                                                    border: 'none'
                                                }} />
                                                <Typography variant="body1" sx={{
                                                    color: 'rgba(255,255,255,0.8)',
                                                    textAlign: 'center',
                                                    lineHeight: 1.6,
                                                    flexGrow: 1,
                                                    mb: 2,
                                                    fontSize: '1rem'
                                                }}>
                                                    {ai.description}
                                                </Typography>
                                                <Box sx={{
                                                    mt: 'auto',
                                                    pt: 2,
                                                    width: '100%'
                                                }}>
                                                    <Box sx={{
                                                        width: '100%',
                                                        height: '2px',
                                                        background: `linear-gradient(90deg, ${ai.avatarColor})`,
                                                        mb: 2,
                                                        borderRadius: '2px'
                                                    }} />
                                                    <Typography variant="caption" sx={{
                                                        color: 'rgba(255,255,255,0.5)',
                                                        fontFamily: '"Roboto Mono", monospace',
                                                        display: 'block',
                                                        textAlign: 'center',
                                                        fontSize: '0.7rem'
                                                    }}>
                                                        ID: {ai.id.split('/')[0]}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Fade>
        </Box>
    );
}

export default AISelection;