import { View, Text, Modal, TextInput, StyleSheet, Alert, Button, TouchableOpacity } from 'react-native';
import React from 'react';
import EmailJS from '@emailjs/react-native';
export default function Contact() {  
    const [show,setShow]=React.useState(false);
    const [name,setName]=React.useState('');
    const [email,setEmail]=React.useState('');
    const [subject,setSubject]=React.useState('');
    const [message,setMessage]=React.useState('');
    const sendEmail= async()=>{
        try{
           await EmailJS.send('service_m1xeknf','template_1g5m9s8',{
                from_name:name,
                subject:subject,
                message:message,
                reply_to:'agbarea.mhmd@gmail.com'
            },{publicKey:'7j32BFbNhoV6WfjJu'}
        );           
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };
    const onPressHandler=()=>{
       
        if(name.length>0 && email.length>0 && subject.length>0 && message.length>0){
            sendEmail();
            setShow(true);
        } else {
           Alert.alert('Error','Please fill all the fields');
        }
    };
    const onPressClear=()=>{
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
    }; 
    return (     
  <View style={styles.container}>
    <Modal transparent visible={show} animationType="slide">   
      <View style={styles.modalContainer}>    
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            Message Sent Successfully
          </Text>
          <Text style={styles.modalText}>
            Thank you {name}
          </Text>
          <Text style={styles.modalText}>
            We will contact you at: {email}
          </Text>
          <Button
            title="Close"
            onPress={() => setShow(false)}
          />
        </View>
      </View>
    </Modal>
    <Text style={styles.label}>Name</Text>
    <TextInput 
      style={styles.input} 
      placeholder="Name"
      value={name}
      onChangeText={setName}
    />
    <Text style={styles.label}>Email</Text>
    <TextInput 
      style={styles.input}
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
    />
    <Text style={styles.label}>Subject</Text>
    <TextInput 
      style={styles.input}
      placeholder="Subject"
      value={subject}
      onChangeText={setSubject}
    />
    <Text style={styles.label}>Message</Text>

    <TextInput 
      style={styles.input}
      placeholder="Message"
      value={message}
      onChangeText={setMessage}
      multiline
      numberOfLines={4}
    />

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPressHandler}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.buttonClear]} onPress={onPressClear}>
        <Text style={styles.buttonText}>Clear</Text>
      </TouchableOpacity>
    </View>

  </View>
)  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    marginTop: 5,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonClear: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

