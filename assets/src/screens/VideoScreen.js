import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Alert, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Switch 
} from 'react-native';
import Video from 'react-native-video';
import axios from 'axios';

const videoContent = {
  // ... existing videoContent object ...
  'Physical and Psychological Effects of Doping': {
    filename: 'doping.mp4',
    description: 'Doping can have profound impacts on both physical and mental health. It alters body chemistry, potentially causing long-term damage to organs, hormonal balance, and psychological well-being. Athletes may experience increased aggression, mood swings, and dependency issues.'
  },
  // Add transcripts for each chapter
  transcripts: {
    'Physical and Psychological Effects of Doping': {
      tamil: `இது விளையாட்டுலகத்தில் ஒரு கரும்புள்ளியை விட்டுச் செல்கிறது. இது ஒழுங்காகவும் எளிதாகவும் புரிந்து கொள்ளப்படும் ஒரு மோசடி. திறனை மேம்படுத்தும் மருந்துகளை பயன்படுத்தி முன்னேறும் விளையாட்டு வீரர்கள் செய்த ஒரு நம்பிக்கைத்துரோகமே இது. இது உங்கள் நினைவுக்குள் இருக்கும் அளவுக்கு மிக அதிகமாக பரவலாக உள்ளது. சைக்கிள் போட்டி முதல் பேஸ்பால் வரை, தடகளத்தைத் தொட்டுக்கொள்வதற்குள் டோப்பிங் சர்ச்சைகள் உலகத்தை அதிர்ச்சி அடையச் செய்துள்ளன.

இந்த சம்பவங்கள் போட்டியின் இருண்ட பக்கத்தை வெளிப்படுத்துகின்றன, அங்கு வெற்றி என்பது எந்தத் தகுதியிலும் ஒரே இலக்கமாக மாறுகிறது. ஆனால் இதற்காக எந்த விலையைக் கொடுக்கிறோம்? புகழின் விருப்பம் விளையாட்டு வீரர்களை ஆபத்தான பாதைக்கு இட்டுச் செல்லும்.

இது உடல்நலத்திற்கும் மனநலத்திற்கும் பாதகமான பாதை. சாதனைகளை உடைத்தெறிந்து பெரிய ஒப்பந்தங்களில் கையெழுத்திடும் ஆர்வம் தீர்மானத்தை மங்கச் செய்யும். இது விளையாட்டு வீரர்கள் மட்டுமல்ல, உண்மையான மனிதர்களைப் பற்றியது. வெற்றியின் கண நேரத்தில் உடலையும் மனதையும் ஆபத்தில் இட்டுவிடுகிறார்கள். இது விளையாட்டு அல்ல; இது நீண்டகால விளைவுகளுடன் கூடிய ஒரு தீவிரமான பிரச்சினை.

நீட்டிக்கப்பட்ட விளைவுகள்
விளம்பர மருந்துகள் உடலுக்கு என்ன செய்கின்றன என்பதைப் பார்ப்போம். இவை உங்கள் உடலமைப்பை முழுமையாக குலைக்கும். உதாரணமாக, அனபோலிக் ஸ்டெராய்டுகள் சின்தடிக் டெஸ்டோஸ்டிரோன் போன்று செயல்பட்டு இதய நோய், யகர பாதிப்பு போன்றவை ஏற்பட வாய்ப்புகளை அதிகரிக்கின்றன.

EPO போன்ற இரத்த செல்கள் பெருக்கும் ஹார்மோன்கள் இரத்தத்தை அடர்த்தியாக்கி ஸ்ட்ரோக் மற்றும் இதயக்கோளாறுகள் போன்ற தீவிர சிக்கல்களை உண்டாக்கும்.

மனநிலை பாதிப்புகள்:
தீவிர மனநிலை மாற்றங்கள், அக்ரோஷம், அவசாதம் போன்றவை ஏற்படுகின்றன. டோப்பிங் ஒழிக்கும்போது இது மேலும் மோசமடையும். மேலும், வெறுப்பும் குற்ற உணர்வும் இழப்பு விளைவிக்கும்.

எதிர்நீக்கம்:
சீர்குலைப்பு நிறுத்தத்திற்கான உதவிகளுடன், நீண்டகால சுகாதாரச் சிக்கல்களைத் தடுக்க வேண்டும். இறுதியாக, விளையாட்டில் நேர்மையான ஆர்வத்தை வளர்க்க நம்பகத்தன்மையும் பொறுப்புகளும் கொண்டதாக ஒரு சமூகத்தை உருவாக்குவோம்.`,
      hindi: `
डोपिंग: खेलों पर काला धब्बा
डोपिंग खेल जगत में एक काला धब्बा छोड़ रही है। यह एक ऐसा धोखा है जो सरल और स्पष्ट रूप से समझा जा सकता है। प्रदर्शन बढ़ाने वाली दवाओं का उपयोग करके खिलाड़ी अपनी प्रगति करते हैं, लेकिन यह विश्वासघात की परिभाषा है। यह समस्या इतनी व्यापक हो चुकी है कि यह खेल इतिहास में हमेशा याद रखी जाएगी। साइकिल रेसिंग से लेकर बेसबॉल और एथलेटिक्स तक, डोपिंग विवादों ने पूरी दुनिया को हिला कर रख दिया है।

ये घटनाएँ खेल के अंधकारमय पहलुओं को उजागर करती हैं, जहाँ जीत एकमात्र उद्देश्य बन जाती है, चाहे इसके लिए कोई भी कीमत क्यों न चुकानी पड़े। लेकिन इस जीत की कीमत क्या है? प्रसिद्धि की चाहत खिलाड़ियों को खतरनाक रास्तों पर ले जाती है।

स्वास्थ्य और मानसिकता पर दुष्प्रभाव
यह सिर्फ एक खेल नहीं है; यह शारीरिक और मानसिक स्वास्थ्य को प्रभावित करने वाला गंभीर मुद्दा है। बड़ी उपलब्धियों और भारी अनुबंधों की चाहत निर्णय लेने की क्षमता को धुंधला कर देती है। यह सिर्फ खिलाड़ियों की बात नहीं है; यह असल इंसानों की बात है, जो अपनी शारीरिक और मानसिक सेहत को एक पल की जीत के लिए जोखिम में डाल देते हैं।

डोपिंग के दीर्घकालिक प्रभाव
आइए देखें कि प्रदर्शन बढ़ाने वाली दवाएँ शरीर के साथ क्या करती हैं। ये आपके शारीरिक तंत्र को पूरी तरह से असंतुलित कर देती हैं। उदाहरण के लिए, एनाबॉलिक स्टेरॉयड्स सिंथेटिक टेस्टोस्टेरोन की तरह काम करते हैं और हृदय रोग तथा यकृत की समस्याओं का खतरा बढ़ा देते हैं।

EPO जैसे रक्त कोशिकाएँ बढ़ाने वाले हार्मोन रक्त को गाढ़ा बनाकर स्ट्रोक और हृदय रोग जैसे गंभीर जोखिम पैदा कर सकते हैं।

मानसिक स्वास्थ्य पर प्रभाव
डोपिंग मानसिक स्थिति को भी बुरी तरह प्रभावित करता है। इससे गंभीर मूड स्विंग्स, आक्रामकता और अवसाद हो सकता है। डोपिंग से बचने के प्रयास में स्थिति और भी खराब हो सकती है। अपराधबोध और पछतावे की भावना अक्सर मनोवैज्ञानिक समस्याओं का कारण बनती है।

समाधान और रोकथाम
हमें इस विनाशकारी प्रक्रिया को रोकने के लिए सामूहिक प्रयास करने की जरूरत है। सशक्त सहायता और सुधारात्मक उपायों के माध्यम से, दीर्घकालिक स्वास्थ्य समस्याओं को रोका जा सकता है। अंततः, हमें एक ऐसी समाज का निर्माण करना होगा जो खेलों में ईमानदारी, भरोसे और जिम्मेदारी को बढ़ावा दे।

खेल सिर्फ जीतने का नाम नहीं है, बल्कि यह अनुशासन, सम्मान और नैतिकता का प्रतीक है। आइए इसे स्वच्छ और स्वस्थ बनाए रखें।`
    },
    
  }
};

export default function VideoScreen({ route }) {
  const { chapterTitle, chapter } = route.params;
  const [paused, setPaused] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  
  // New state for language and transcript
  const [language, setLanguage] = useState('tamil'); // Default language
  const [showTranscript, setShowTranscript] = useState(false);

  // Fetch video URL when component mounts
  React.useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const content = videoContent[chapter];
        
        // Skip URL fetching for PDFs
        if (content.filename.endsWith('.pdf')) {
          return;
        }

        // Construct the URL for the video
        const response = await axios.get(`http://127.0.0.1:8000/images/${content.filename}`);
        
        // If the response includes an image_url or direct video URL
        const videoSource = response.data.image_url || 
                            `http://127.0.0.1:8000/images/${content.filename}`;
        
        setVideoUrl(videoSource);
      } catch (error) {
        console.error('Video fetch error:', error);
        Alert.alert('Error', 'Could not load video');
      }
    };

    fetchVideoUrl();
  }, [chapter]);

  // Get the current transcript
  const getCurrentTranscript = () => {
    return videoContent.transcripts[chapter]?.[language] || 'No transcript available.';
  };

  return (
    <ScrollView 
      style={styles.scrollViewContainer}
      contentContainerStyle={styles.scrollViewContent}
    >
      <View style={styles.container}>
        {/* Language and Transcript Controls */}
        <View style={styles.languageContainer}>
          <View style={styles.languageSwitcher}>
            <Text style={styles.languageText}>
              {language === 'tamil' ? 'தமிழ்' : 'हिंदी'}
            </Text>
            <Switch
              value={language === 'hindi'}
              onValueChange={(switchValue) => 
                setLanguage(switchValue ? 'hindi' : 'tamil')
              }
            />
          </View>
          
          <TouchableOpacity 
            style={styles.transcriptToggle}
            onPress={() => setShowTranscript(!showTranscript)}
          >
            <Text style={styles.transcriptToggleText}>
              {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Video Container */}
        <View style={styles.videoContainer}>
          {videoContent[chapter]?.filename.endsWith('.pdf') ? (
            <TouchableOpacity 
              style={styles.pdfContainer} 
              onPress={() => {/* PDF opening logic */}}
            >
              <Text style={styles.pdfNotice}>📄 Open PDF Document</Text>
            </TouchableOpacity>
          ) : videoUrl ? (
            <Video
              source={{ uri: videoUrl }}
              style={styles.video}
              resizeMode="contain"
              paused={paused}
              controls={true}
            />
          ) : (
            <Text style={styles.loadingText}>Loading video...</Text>
          )}
        </View>

        {/* Description Container */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.chapterTitle}>{chapter}</Text>
          <Text style={styles.description}>
            {videoContent[chapter]?.description}
          </Text>
        </View>

        {/* Transcript Container */}
        {showTranscript && (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptTitle}>Transcript</Text>
            <ScrollView style={styles.transcriptScrollView}>
              <Text style={styles.transcriptText}>
                {getCurrentTranscript()}
              </Text>
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingVertical: 20,
    minHeight: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    width: '100%',
    height: Dimensions.get('window').width * 0.6, // 16:9 aspect ratio
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  pdfContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pdfNotice: {
    color: '#ffffff',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pdfSubtitle: {
    color: '#cccccc',
    fontSize: 16,
    marginTop: 10,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
  },
  descriptionContainer: {
    padding: 20,
    backgroundColor: '#D8D2C2',
  },
  chapterTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#03615b',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  languageSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  transcriptToggle: {
    padding: 8,
    backgroundColor: '#03615b',
    borderRadius: 5,
  },
  transcriptToggleText: {
    color: 'white',
  },
  transcriptContainer: {
    padding: 15,
    backgroundColor: '#E8E8E8',
    maxHeight: 250,
  },
  transcriptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#03615b',
  },
  transcriptScrollView: {
    maxHeight: 200,
  },
  transcriptText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
});
