import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, Image, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackButton from './BackButton';
const DopingScandalsTimeline = () => {
  const navigation = useNavigation(); 
  const timelineEvents = [
    {
      year: "1967",
      title: "Cyclist Tom Simpson dies after Tour de France",
      description: "Cyclist Tom Simpson passed away during the Tour de France due to a heart attack caused by dehydration and amphetamines.",
      image: "https://www.dropbox.com/scl/fi/55pid40er3fnk0of9zrje/1967.png?rlkey=y7uc8006gtlss234x1xphkhc1&raw=1",
      learnMoreLink: "https://en.wikipedia.org/wiki/Tom_Simpson_(cyclist)",
    },
    {
      year: "1970s-1980s",
      title: "German government forces its athletes to use steroids",
      description: "The East German government dosed its athletes with performance-enhancing drugs, leading to a state-sponsored doping scandal.",
      image: "https://www.dropbox.com/scl/fi/lvoaklxnmllpxfpb3oi4q/1970.png?rlkey=mahvyd246f4q3aj0ci58684vn&raw=1",
      learnMoreLink: "https://en.wikipedia.org/wiki/East_German_doping_scandal",
    },
    {
      year: "1988",
      title: "Track star Ben Johnson tests positive for steroids",
      description: "Ben Johnson, the Canadian track star, tested positive for steroids after winning the 100m gold at the 1988 Seoul Olympics.",
      image: "https://www.dropbox.com/scl/fi/3fdipga2cw7edmxq9npch/1988.png?rlkey=c4jyl5ioyunplh1xhh0f7nq1m&raw=1",
      learnMoreLink: "https://en.wikipedia.org/wiki/Ben_Johnson_(sprinter)",
    },
    {
      year: "1994",
      title: "Diego Maradona's ephedrine use eliminates the soccer player from the World Cup",
      description: "Diego Maradona was banned from the 1994 World Cup after testing positive for ephedrine.",
      image: "https://www.dropbox.com/scl/fi/qpy5zddo97lt6kjls0hkx/1994.png?rlkey=lgca1bo58zg4ntd8yjxxyn7lm&raw=1",
      learnMoreLink: "https://en.wikipedia.org/wiki/Diego_Maradona#1994_World_Cup_doping_scandal",
    },
    {
      year: "1998",
      title: "Tour de France Doping Scandal",
      description: "The 1998 Tour de France was marred by a doping scandal, with several top riders, including Jan Ullrich, being linked to the Festina team’s doping program.",
      image: "https://www.dropbox.com/scl/fi/ggx6469ealzg7d3wg73yi/1998.png?rlkey=10y91z1ejhhf25nop6ymxaj1x&raw=1",
      learnMoreLink: "https://en.wikipedia.org/wiki/1998_Tour_de_France_doping_scandal",
    },
    {
      year: "2012",
      title: "Lance Armstrong Doping Scandal",
      description: "Lance Armstrong was stripped of his seven Tour de France titles after an investigation found he had used performance-enhancing drugs throughout his career.",
      image: "https://www.dropbox.com/scl/fi/e21cl038nmat4ylc30d3i/2012.png?rlkey=dy9q9ui5icvv71xwq1p7l3met&raw=1",
      learnMoreLink: "https://en.wikipedia.org/wiki/Lance_Armstrong_doping_scandal",
    },
    {
      year: "2014",
      title: "Maria Sharapova Fails Drug Test",
      description: "Russian tennis player Maria Sharapova was banned for two years after testing positive for the drug meldonium, which was added to the banned list in 2016.",
      image: "https://www.dropbox.com/scl/fi/wyhxt97wb0xrdkilsjsm5/2014.png?rlkey=59x8jei5b2acpriky5lyvk1fx&raw=1",
      learnMoreLink: "https://en.wikipedia.org/wiki/Maria_Sharapova_doping_case",
    },
    {
      year: "2020",
      title: "Canelo Alvarez Suspended for Clenbuterol Use",
      description: "Mexican boxer Canelo Alvarez tested positive for clenbuterol, a substance used to enhance athletic performance, leading to a suspension from the sport.",
      image: "https://www.dropbox.com/scl/fi/bqy96lms9xljnvfetmuhm/2020.png?rlkey=c8yt9re4wnmyy9dgc4psdb7uz&raw=1",
      learnMoreLink: "https://en.wikipedia.org/wiki/Canelo_Álvarez#Doping_suspension",
    },
    {
      year: "2021",
      title: "Tokyo Olympics Doping Scandal",
      description: "Multiple athletes faced disqualification from the Tokyo Olympics after testing positive for banned substances, raising concerns about global anti-doping protocols.",
      image: "https://www.dropbox.com/scl/fi/hef3xc5iqkirmx25nr265/2021.png?rlkey=1z63xzwkt59goe6c3e6hejuk3&raw=1",
      learnMoreLink: "https://en.wikipedia.org/wiki/Tokyo_2020_doping_scandal",
    },
    {
      year: "2022",
      title: "Athletics Federation Enhances Doping Detection",
      description: "The International Athletics Federation introduced advanced testing methods, including AI-driven analysis, which uncovered doping violations by several high-profile athletes.",
      image: "https://www.dropbox.com/scl/fi/bqlb5h9f9efq3ypdizubi/2022.png?rlkey=kzv1xot3dnzl3ud8ge0nm4uys&raw=1",
      learnMoreLink: "https://en.wikipedia.org/wiki/Athletics_doping_detection",
    },
    {
      year: "2023",
      title: "Cycling Team Faces Lifetime Ban",
      description: "A professional cycling team was banned for life after an investigation revealed systematic doping among its members, involving sophisticated evasion techniques.",
      image: "https://www.dropbox.com/scl/fi/2tpfqdi973uc1upht6m5y/2023.png?rlkey=wrfjuss29c4rfdfdggk4dpyqh&raw=1",
      learnMoreLink: "https://en.wikipedia.org/wiki/Cycling_team_doping_2023",
    },
    {
      year: "2024",
      title: "Breakthrough in Genetic Doping Research",
      description: "A groundbreaking study uncovered evidence of genetic manipulation in sports, sparking debates about the ethical boundaries of performance enhancement.",
      image: "https://www.dropbox.com/scl/fi/c1ewynii13bipm714ly7u/2024.png?rlkey=nun7lq347emaaotjjl4tt8ygx&raw=1",
      learnMoreLink: "https://en.wikipedia.org/wiki/Genetic_doping_in_sports",
    },
  ];

 

  

  const fadeAnims = timelineEvents.map(() => new Animated.Value(0));

  useEffect(() => {
    fadeAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 200,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Doping Scandals Timeline</Text>
        <View style={styles.timeline}>
          {timelineEvents.map((event, index) => (
            <Animated.View
              key={index}
              style={[
                styles.eventContainer,
                { opacity: fadeAnims[index] },
                { transform: [{ scale: fadeAnims[index].interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] },
              ]}
            >
              <Image source={event.image} style={styles.eventImage} />
              <View style={styles.eventContent}>
                <Text style={styles.year}>{event.year}</Text>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.description}>{event.description}</Text>
                <TouchableOpacity
                  style={styles.learnMoreButton}
                  onPress={() => Linking.openURL(event.learnMoreLink)}
                >
                  <Text style={styles.learnMoreText}>Learn More</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 25,
    backgroundColor: '#000000',
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeline: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  eventContainer: {
    width: 275,
    backgroundColor: '#000000',
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  eventContent: {
    padding: 15,
  },
  year: {
    fontSize: 20,
    color: '#26732C',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
  },
  learnMoreButton: {
    backgroundColor: '#26732C',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default DopingScandalsTimeline;