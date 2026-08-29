import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyANG2wImtPfbQHudbwN-eNjRgM9oAaOwhY');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
export default function GeminiChat() {
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const flatListRef = React.useRef(null);
    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        try {
            const chat = model.startChat({
                history: messages.map((msg) => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }))
            });
            const result = await chat.sendMessage(input);
            const text = result.response.text();
            const botMessage = { id: Date.now().toString(), text, sender: 'bot' };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };
    const renderItem = ({ item }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
                <Text style={isUser ? styles.userText : styles.botText}>{item.text}</Text>
            </View>
        );
    };
    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.header}>
                <Text style={styles.title}>Gemini AI Chat</Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={[...messages].reverse()}
                inverted
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.chatContainer}
                showsVerticalScrollIndicator={false}
            />
            {loading && <Text style={styles.loadingText}>Typing...</Text>}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder='Ask Gemini anything...'
                    placeholderTextColor="#888"
                    multiline
                />
                <TouchableOpacity 
                    style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} 
                    onPress={sendMessage}
                    disabled={!input.trim()}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E9F0',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2E3A59',
    },
    chatContainer: {
        flexGrow: 1,
        padding: 15,
    },
    messageBubble: {
        maxWidth: '80%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginVertical: 6,
        borderRadius: 20,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
        borderBottomRightRadius: 4,
    },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    userText: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 22,
    },
    botText: {
        color: '#2E3A59',
        fontSize: 16,
        lineHeight: 22,
    },
    loadingText: {
        textAlign: 'center',
        marginVertical: 5,
        color: '#8F9BB3',
        fontSize: 14,
        fontStyle: 'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderColor: '#E5E9F0',
    },
    input: {
        flex: 1,
        backgroundColor: '#F7F9FC',
        borderWidth: 1,
        borderColor: '#E5E9F0',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 12 : 10,
        paddingBottom: Platform.OS === 'ios' ? 12 : 10,
        marginRight: 10,
        fontSize: 16,
        maxHeight: 100,
        color: '#2E3A59',
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    sendButtonDisabled: {
        backgroundColor: '#A6C8FF',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});