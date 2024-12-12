import React, { useState, useRef } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ConfettiCannon from 'react-native-confetti-cannon';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const navigation = useNavigation();
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answerStatus, setAnswerStatus] = useState("");
  const [hasAnsweredCorrectly, setHasAnsweredCorrectly] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);
  const [categorySelected, setCategorySelected] = useState(false);
  const [isInstructionsVisible, setIsInstructionsVisible] = useState(true); // State for instructions visibility
  const confettiRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [avatarPosition, setAvatarPosition] = useState(-44);
  const MAX_POSITION = 35;
  const MIN_POSITION = -45;
  const MOVEMENT_INCREMENT = 5.2;

  const categories = [
    
    { name: 'General Knowledge about Anti-Doping', description: 'Basics of clean sports and anti-doping efforts.',
      questions: [
        { 
            question: "Doping is only illegal in professional sports.", 
            answer: false, 
            explanation: "Doping is prohibited in both professional and amateur sports, as it undermines the fairness of competition at all levels. Organizations like the World Anti-Doping Agency (WADA) regulate anti-doping policies globally, ensuring a level playing field for all athletes." 
        },
        { 
            question: "Athletes can be randomly tested for doping during competitions.", 
            answer: true, 
            explanation: "Random drug testing is a common practice in sports to ensure that athletes do not use performance-enhancing substances to gain an unfair advantage. Testing can occur at any point during a competition, including pre-competition, in-competition, and post-competition." 
        },
        { 
            question: "Taking performance-enhancing drugs (PEDs) is a new phenomenon in sports.", 
            answer: false, 
            explanation: "Doping has a long history in sports, with ancient Olympic athletes using various substances to enhance their performance. While the substances and methods have evolved, the practice of doping dates back to at least the 19th century, if not earlier." 
        },
        { 
            question: "The World Anti-Doping Agency (WADA) was established to combat doping in sports worldwide.", 
            answer: true, 
            explanation: "WADA was founded in 1999 to promote doping-free sports worldwide, creating a global standard for anti-doping regulations. Its mission includes coordinating efforts among national and international sports federations, governments, and other stakeholders to combat doping." 
        },
        { 
            question: "Doping is only harmful to the athletes who take the drugs.", 
            answer: false, 
            explanation: "Doping harms the integrity of sports as a whole, not just the individual athletes using banned substances. Clean athletes who follow the rules are often unfairly disadvantaged, and the overall trust in sports can be diminished if doping is prevalent." 
        },
        { 
            question: "Doping is always detected through urine tests.", 
            answer: false, 
            explanation: "Doping can be detected through both urine and blood tests, depending on the type of substance or method being tested for. Blood tests are often used to detect substances like EPO or blood doping, which cannot always be detected in urine." 
        },
        { 
            question: "An athlete can appeal their doping violation decision.", 
            answer: true, 
            explanation: "Athletes have the right to appeal their doping violation decisions through legal channels such as the Court of Arbitration for Sport (CAS). This allows athletes to present evidence or arguments to contest their case and possibly reduce penalties or overturn a ruling." 
        },
        { 
            question: "The anti-doping community only focuses on professional athletes.", 
            answer: false, 
            explanation: "Anti-doping efforts extend to athletes at all levels, including amateur and youth athletes. Ensuring clean competition and promoting fair play are critical at all levels, not just in professional sports. Anti-doping programs aim to maintain the integrity of sport for all participants." 
        },
        { 
            question: "Only steroids are considered doping substances.", 
            answer: false, 
            explanation: "Steroids are just one class of doping substances. Other substances such as stimulants, hormones (like EPO), and methods like blood doping are also considered doping and are banned in sports. WADA maintains an extensive list of banned substances and methods." 
        },
        { 
            question: "Some substances that enhance performance are legally available over the counter.", 
            answer: true, 
            explanation: "Certain substances like caffeine and creatine, which can enhance performance, are legally available over the counter. However, they are still regulated in some sports, especially if used in excessive amounts or combined with other substances that may be banned." 
        },
        { 
            question: "An athlete can be banned for life if caught using doping substances more than once.", 
            answer: true, 
            explanation: "An athlete can face a lifetime ban if caught using banned substances multiple times. Repeated violations reflect a disregard for the rules and can be seen as a serious breach of the integrity of the sport." 
        },
        { 
            question: "All forms of doping increase an athlete's stamina and strength.", 
            answer: false, 
            explanation: "Different doping substances affect various aspects of athletic performance. Some enhance stamina (like EPO), others improve strength (such as anabolic steroids), and some might focus on recovery or speed. Not all doping methods work in the same way." 
        },
        { 
            question: "An athlete can use a banned substance if prescribed by a doctor.", 
            answer: false, 
            explanation: "Even if a doctor prescribes a substance, it may still be banned in sports. Athletes must apply for a Therapeutic Use Exemption (TUE) to use certain prescribed substances legally during competition. This ensures the substance is medically necessary and doesn’t offer an unfair advantage." 
        },
        { 
            question: "Only banned substances can cause a doping violation.", 
            answer: false, 
            explanation: "Doping violations can also arise from certain methods, such as blood transfusions or gene doping, which are not based on banned substances. These methods are considered doping because they enhance performance in ways that violate fair competition principles." 
        },
        { 
            question: "Doping is only detected in athletes competing in major international events.", 
            answer: false, 
            explanation: "Doping tests are conducted at all levels of competition, not just in major international events. Local competitions, national championships, and even training camps can be subject to doping tests to ensure clean athletes at every level." 
        }
    ]},    
    { name: 'Health and Safety Impacts', description: 'Risks of banned substances on athletes health',
      questions: [
        { 
            question: "Steroids can increase muscle mass and strength.", 
            answer: true, 
            explanation: "Steroids, particularly anabolic steroids, are known to promote muscle growth and increase strength. They work by mimicking the effects of the male hormone testosterone, which enhances muscle mass and recovery. However, their use comes with significant health risks." 
        },
        { 
            question: "Doping can lead to long-term organ damage.", 
            answer: true, 
            explanation: "Some doping substances, like steroids or other hormone-based drugs, can cause irreversible damage to vital organs like the heart, liver, and kidneys. Long-term use can lead to serious conditions, including heart disease, liver failure, and kidney dysfunction." 
        },
        { 
            question: "Using stimulants for performance can lead to increased energy with no side effects.", 
            answer: false, 
            explanation: "While stimulants can temporarily boost energy and alertness, they come with significant side effects. These include increased heart rate, anxiety, and potential long-term damage to the cardiovascular system. Overuse can also lead to addiction and other psychological issues." 
        },
        { 
            question: "Doping can affect mental health and lead to aggression and paranoia.", 
            answer: true, 
            explanation: "Some doping substances, particularly steroids, can negatively affect mood and behavior. These substances can lead to increased aggression, anxiety, paranoia, and other mental health issues. This phenomenon is often referred to as 'roid rage.'" 
        },
        { 
            question: "Doping only impacts an athlete’s physical performance, not their mental health.", 
            answer: false, 
            explanation: "Doping not only affects an athlete’s physical performance but can also have severe consequences for their mental health. Psychological effects like anxiety, depression, aggression, and mood swings are common side effects of certain doping substances." 
        },
        { 
            question: "Hormone-based doping can result in infertility.", 
            answer: true, 
            explanation: "Hormone-based doping, such as the use of anabolic steroids or other performance-enhancing drugs, can disrupt the natural hormonal balance in the body, leading to infertility. This is especially true for men, whose testosterone levels may be permanently affected by long-term steroid use." 
        },
        { 
            question: "Doping substances can cause irreversible changes to the body’s metabolism.", 
            answer: true, 
            explanation: "Certain doping substances can interfere with the body's natural metabolic processes. For example, steroids can alter the hormonal balance, affecting metabolism and leading to long-term disruptions that can be difficult or impossible to reverse." 
        },
        { 
            question: "Doping substances can weaken the immune system, making athletes more susceptible to infections.", 
            answer: true, 
            explanation: "Some doping substances, such as steroids, can suppress the immune system, making athletes more vulnerable to infections. The use of such substances can decrease the body’s ability to fight off bacteria, viruses, and other pathogens." 
        },
        { 
            question: "Athletes who use PEDs often experience quicker recovery times after injury.", 
            answer: true, 
            explanation: "Certain performance-enhancing drugs (PEDs), like growth hormones and steroids, can speed up recovery from injuries by promoting faster tissue repair and reducing inflammation. However, the long-term risks of using these substances outweigh the short-term benefits." 
        },
        { 
            question: "Doping has no effect on bone density or structure.", 
            answer: false, 
            explanation: "Some doping substances, especially anabolic steroids, can negatively affect bone density. Steroids can cause bones to become weaker over time, increasing the risk of fractures and osteoporosis." 
        },
        { 
            question: "Doping can lead to cardiovascular problems such as high blood pressure and heart attacks.", 
            answer: true, 
            explanation: "Many doping substances, such as steroids and other stimulants, can strain the cardiovascular system. They can cause high blood pressure, increase the risk of heart attacks, and lead to other cardiovascular issues, including stroke and arrhythmia." 
        },
        { 
            question: "Taking large amounts of caffeine is a form of doping.", 
            answer: false, 
            explanation: "Caffeine is only considered a doping substance at extremely high doses. While moderate caffeine use can enhance performance, it does not meet the threshold for doping unless consumed in quantities far beyond the normal levels, which are unlikely in most competitive environments." 
        },
        { 
            question: "Doping can improve an athlete’s performance in the short term but might cause long-term health damage.", 
            answer: true, 
            explanation: "Doping can temporarily boost athletic performance by increasing strength, stamina, or recovery. However, these substances often come with serious long-term health risks, including organ damage, mental health issues, and weakened immune function." 
        },
        { 
            question: "An athlete’s life expectancy is not impacted by doping.", 
            answer: false, 
            explanation: "Doping can shorten an athlete's life expectancy due to the long-term health consequences of using banned substances. Chronic use of certain PEDs can lead to heart disease, liver failure, kidney damage, and other life-threatening conditions." 
        },
        { 
            question: "Doping is safe if done in moderation.", 
            answer: false, 
            explanation: "Even moderate use of doping substances is dangerous. The risks of organ damage, cardiovascular issues, hormonal imbalances, and mental health problems are significant and cannot be considered safe, regardless of the dosage." 
        }
    ]
  },    
    { name: 'Real Life Cases',description: 'Doping scandals and their consequences.',
      questions: [
      { 
          question: "Lance Armstrong was stripped of his Tour de France titles for doping.", 
          answer: true, 
          explanation: "Lance Armstrong, a seven-time Tour de France winner, was stripped of all his titles and banned for life after confessing to using performance-enhancing drugs during his career. This scandal is one of the most prominent doping cases in sports history." 
      },
      { 
          question: "Ben Johnson was caught doping after winning the 1988 Seoul Olympics.", 
          answer: true, 
          explanation: "Ben Johnson, a Canadian sprinter, won the 100m gold medal at the 1988 Seoul Olympics but was disqualified after testing positive for anabolic steroids. His case is one of the most infamous doping incidents in Olympic history." 
      },
      { 
          question: "Marion Jones was not involved in any doping scandals during her career.", 
          answer: false, 
          explanation: "Marion Jones, a U.S. track and field athlete, admitted to using performance-enhancing drugs during her career. She was stripped of five Olympic medals won at the 2000 Sydney Olympics and served a prison sentence for lying to federal investigators." 
      },
      { 
          question: "Russia was banned from the 2016 Rio Olympics due to a state-sponsored doping scandal.", 
          answer: true, 
          explanation: "Russia faced a partial ban from the 2016 Rio Olympics following revelations of a state-sponsored doping program. Some athletes were barred from participating, and the scandal highlighted widespread corruption in the country's sports system." 
      },
      { 
          question: "Usain Bolt was accused of doping after his gold medal win in the 2008 Olympics.", 
          answer: false, 
          explanation: "Usain Bolt, the legendary Jamaican sprinter, has never been found guilty of doping. His gold medal-winning performances in the 2008 Olympics and beyond remain free of any doping allegations." 
      },
      { 
          question: "Tyson Gay, an American sprinter, tested positive for doping during his career.", 
          answer: true, 
          explanation: "Tyson Gay, one of the fastest sprinters in history, tested positive for a banned substance in 2013. He was banned from competition and returned his silver medal from the 2012 London Olympics as a result." 
      },
      { 
          question: "The Russian government was involved in a coordinated effort to cover up doping violations.", 
          answer: true, 
          explanation: "The Russian state-sponsored doping program, exposed by whistleblowers and investigations, involved systematic use of performance-enhancing drugs and cover-ups. This led to bans on Russian athletes and the country’s suspension from international events." 
      },
      { 
          question: "In the 2012 Olympics, no athlete was found guilty of doping.", 
          answer: false, 
          explanation: "Several athletes were found guilty of doping during the 2012 London Olympics. Retesting of samples in subsequent years revealed more positive cases, leading to disqualifications and medal reallocations." 
      },
      { 
          question: "The 2000 Sydney Olympics were free of doping cases.", 
          answer: false, 
          explanation: "The 2000 Sydney Olympics were not free of doping cases. Athletes were later found to have used performance-enhancing drugs, including some who had initially won medals." 
      },
      { 
          question: "The Tour de France had no doping controversies until 1998.", 
          answer: false, 
          explanation: "Doping controversies in the Tour de France date back many decades, long before 1998. The 1998 Festina Affair was a particularly prominent case, but doping has been a recurring issue in the event's history." 
      },
      { 
          question: "The case of East German athletes doping in the 1970s and 1980s is one of the most famous doping scandals in history.", 
          answer: true, 
          explanation: "The East German government systematically administered performance-enhancing drugs to its athletes in the 1970s and 1980s. This state-sponsored program aimed to dominate international sports and is one of the most infamous doping scandals in history." 
      },
      { 
          question: "The IAAF has never banned an athlete for doping in track and field events.", 
          answer: false, 
          explanation: "The International Association of Athletics Federations (IAAF), now known as World Athletics, has banned many athletes for doping in track and field events. The organization works closely with anti-doping agencies to enforce strict regulations." 
      },
      { 
          question: "A Russian whistleblower played a significant role in exposing the state-sponsored doping program.", 
          answer: true, 
          explanation: "Grigory Rodchenkov, a former head of Russia’s anti-doping lab, became a whistleblower and exposed the country’s state-sponsored doping program. His revelations were pivotal in uncovering the extent of the scandal." 
      },
      { 
          question: "The International Olympic Committee (IOC) is not involved in anti-doping enforcement.", 
          answer: false, 
          explanation: "The International Olympic Committee (IOC) plays a significant role in anti-doping enforcement. It collaborates with the World Anti-Doping Agency (WADA) to ensure compliance with anti-doping regulations during the Olympics." 
      },
      { 
          question: "A cyclist named Alberto Contador was banned for doping during the 2010 Tour de France.", 
          answer: true, 
          explanation: "Alberto Contador, a Spanish cyclist, was found guilty of doping after testing positive for clenbuterol during the 2010 Tour de France. He was stripped of his title and served a two-year ban." 
      }
  ]
    },  
    { name: 'Rules and Regulations in Sports',
      description: 'Overview of anti-doping rules in sports.', questions: 
      [
        { 
            question: "Athletes must declare all medications and supplements to doping authorities.", 
            answer: true, 
            explanation: "Athletes are required to declare all medications and supplements they use to anti-doping authorities to ensure transparency and prevent inadvertent use of banned substances. This helps assess any Therapeutic Use Exemption (TUE) requirements." 
        },
        { 
            question: "The minimum age for doping tests is 18 years.", 
            answer: false, 
            explanation: "There is no minimum age for doping tests. Anti-doping rules apply to athletes of all ages, including minors, depending on the level of competition and jurisdiction." 
        },
        { 
            question: "Random doping tests occur during major sports events only.", 
            answer: false, 
            explanation: "Random doping tests can occur at any time, including out-of-competition periods. Testing is conducted year-round to ensure a level playing field and detect banned substance use beyond event periods." 
        },
        { 
            question: "Refusal to undergo a doping test is treated as a violation.", 
            answer: true, 
            explanation: "Refusing to take a doping test is considered a violation of anti-doping rules. Such refusal is treated the same as a positive test and may result in severe penalties, including suspensions." 
        },
        { 
            question: "An athlete can appeal a positive doping test result.", 
            answer: true, 
            explanation: "Athletes have the right to appeal a positive doping test result. Appeals are typically reviewed by relevant anti-doping organizations or arbitration bodies, such as the Court of Arbitration for Sport (CAS)." 
        },
        { 
            question: "Team managers are exempt from anti-doping rules.", 
            answer: false, 
            explanation: "Team managers, along with coaches and support staff, are subject to anti-doping rules. They can face penalties for facilitating or being complicit in doping practices." 
        },
        { 
            question: "Using someone else’s sample during a test is considered tampering.", 
            answer: true, 
            explanation: "Tampering with the doping control process, including substituting samples, is a serious anti-doping violation. It carries strict penalties, as it undermines the integrity of the testing process." 
        },
        { 
            question: "Banned substance lists are consistent across all countries.", 
            answer: true, 
            explanation: "The World Anti-Doping Agency (WADA) maintains a global list of prohibited substances and methods, ensuring uniformity in anti-doping standards across all countries and sports." 
        },
        { 
            question: "Supplements purchased online are always WADA-compliant.", 
            answer: false, 
            explanation: "Supplements purchased online are not always WADA-compliant. They may contain banned substances not listed on the label, and athletes are advised to exercise caution when using them." 
        },
        { 
            question: "Doping tests include psychological evaluations.", 
            answer: false, 
            explanation: "Doping tests focus solely on the detection of banned substances or methods. They do not include psychological evaluations, which are separate processes." 
        },
        { 
            question: "Missing three doping tests in 12 months can lead to a suspension.", 
            answer: true, 
            explanation: "Athletes who miss three doping tests within a 12-month period can face a suspension under the 'whereabouts failure' rule. This ensures compliance with out-of-competition testing requirements." 
        },
        { 
            question: "Out-of-competition testing is optional for athletes.", 
            answer: false, 
            explanation: "Out-of-competition testing is mandatory for athletes in many sports, as it prevents the use of banned substances during training periods that may enhance performance in future events." 
        },
        { 
            question: "Doping violations can result in forfeiting prize money.", 
            answer: true, 
            explanation: "Athletes found guilty of doping violations are often required to forfeit prize money, titles, and awards they won during the period they were found to be in violation." 
        },
        { 
            question: "Coaches and doctors are accountable under anti-doping rules.", 
            answer: true, 
            explanation: "Coaches, doctors, and other members of an athlete's support team are accountable under anti-doping rules. They can face sanctions for aiding or abetting doping practices." 
        },
        { 
            question: "Every athlete must complete anti-doping education courses.", 
            answer: true, 
            explanation: "Anti-doping education courses are mandatory for athletes to ensure they understand the rules, risks of doping, and the importance of clean sport." 
        }
    ] },
    { name: 'Ethics and Fair Play',
      description: 'Importance of integrity and fairness in competition.', questions:
      [
        { 
            question: "Athletes must declare all medications and supplements to doping authorities.", 
            answer: true, 
            explanation: "Athletes are required to declare all medications and supplements they use to anti-doping authorities to ensure transparency and prevent inadvertent use of banned substances. This helps assess any Therapeutic Use Exemption (TUE) requirements." 
        },
        { 
            question: "The minimum age for doping tests is 18 years.", 
            answer: false, 
            explanation: "There is no minimum age for doping tests. Anti-doping rules apply to athletes of all ages, including minors, depending on the level of competition and jurisdiction." 
        },
        { 
            question: "Random doping tests occur during major sports events only.", 
            answer: false, 
            explanation: "Random doping tests can occur at any time, including out-of-competition periods. Testing is conducted year-round to ensure a level playing field and detect banned substance use beyond event periods." 
        },
        { 
            question: "Refusal to undergo a doping test is treated as a violation.", 
            answer: true, 
            explanation: "Refusing to take a doping test is considered a violation of anti-doping rules. Such refusal is treated the same as a positive test and may result in severe penalties, including suspensions." 
        },
        { 
            question: "An athlete can appeal a positive doping test result.", 
            answer: true, 
            explanation: "Athletes have the right to appeal a positive doping test result. Appeals are typically reviewed by relevant anti-doping organizations or arbitration bodies, such as the Court of Arbitration for Sport (CAS)." 
        },
        { 
            question: "Team managers are exempt from anti-doping rules.", 
            answer: false, 
            explanation: "Team managers, along with coaches and support staff, are subject to anti-doping rules. They can face penalties for facilitating or being complicit in doping practices." 
        },
        { 
            question: "Using someone else’s sample during a test is considered tampering.", 
            answer: true, 
            explanation: "Tampering with the doping control process, including substituting samples, is a serious anti-doping violation. It carries strict penalties, as it undermines the integrity of the testing process." 
        },
        { 
            question: "Banned substance lists are consistent across all countries.", 
            answer: true, 
            explanation: "The World Anti-Doping Agency (WADA) maintains a global list of prohibited substances and methods, ensuring uniformity in anti-doping standards across all countries and sports." 
        },
        { 
            question: "Supplements purchased online are always WADA-compliant.", 
            answer: false, 
            explanation: "Supplements purchased online are not always WADA-compliant. They may contain banned substances not listed on the label, and athletes are advised to exercise caution when using them." 
        },
        { 
            question: "Doping tests include psychological evaluations.", 
            answer: false, 
            explanation: "Doping tests focus solely on the detection of banned substances or methods. They do not include psychological evaluations, which are separate processes." 
        },
        { 
            question: "Missing three doping tests in 12 months can lead to a suspension.", 
            answer: true, 
            explanation: "Athletes who miss three doping tests within a 12-month period can face a suspension under the 'whereabouts failure' rule. This ensures compliance with out-of-competition testing requirements." 
        },
        { 
            question: "Out-of-competition testing is optional for athletes.", 
            answer: false, 
            explanation: "Out-of-competition testing is mandatory for athletes in many sports, as it prevents the use of banned substances during training periods that may enhance performance in future events." 
        },
        { 
            question: "Doping violations can result in forfeiting prize money.", 
            answer: true, 
            explanation: "Athletes found guilty of doping violations are often required to forfeit prize money, titles, and awards they won during the period they were found to be in violation." 
        },
        { 
            question: "Coaches and doctors are accountable under anti-doping rules.", 
            answer: true, 
            explanation: "Coaches, doctors, and other members of an athlete's support team are accountable under anti-doping rules. They can face sanctions for aiding or abetting doping practices." 
        },
        { 
            question: "Every athlete must complete anti-doping education courses.", 
            answer: true, 
            explanation: "Anti-doping education courses are mandatory for athletes to ensure they understand the rules, risks of doping, and the importance of clean sport." 
        }
    ]
      },
    { name: 'Banned Substances in Sports',
      description: 'Substances prohibited for performance enhancement.', questions:
      [
        {
            question: "Anabolic steroids are banned because they promote muscle growth and improve strength.",
            answer: true,
            explanation: "Anabolic steroids are synthetic substances that mimic the effects of naturally occurring testosterone. They are banned because they can promote muscle growth, enhance strength, and give athletes an unfair advantage. Their use also poses significant health risks."
        },
        {
            question: "Testosterone is a naturally occurring hormone but is banned when used as a performance enhancer.",
            answer: true,
            explanation: "Testosterone is naturally produced by the body, but when used as a performance enhancer, it is considered doping. It can increase muscle mass and strength, and its misuse is banned under anti-doping regulations."
        },
        {
            question: "Diuretics are banned because they can lead to dehydration and mask other banned substances.",
            answer: true,
            explanation: "Diuretics are banned because they can cause dehydration, which puts athletes' health at risk. Additionally, they can be used to mask the presence of other performance-enhancing drugs (PEDs) in the body, making them harder to detect during tests."
        },
        {
            question: "Caffeine is banned in high doses during competitions according to WADA guidelines.",
            answer: true,
            explanation: "Caffeine is a stimulant that can enhance performance, especially in endurance sports. However, when consumed in high doses, it is considered a doping substance, and its use during competition is limited under WADA's guidelines."
        },
        {
            question: "Erythropoietin (EPO) is a banned substance because it artificially increases the production of red blood cells to improve endurance.",
            answer: true,
            explanation: "Erythropoietin (EPO) stimulates the production of red blood cells, which enhances an athlete's oxygen-carrying capacity and endurance. Its use is banned because it gives athletes an unfair advantage and poses serious health risks, such as increased blood viscosity."
        },
        {
            question: "Blood doping, which involves injecting additional red blood cells into the body, is not banned.",
            answer: false,
            explanation: "Blood doping, which involves transfusing extra red blood cells to increase the oxygen supply to muscles, is banned in sports. It provides an unfair advantage and carries significant health risks, including blood clotting, strokes, and heart attacks."
        },
        {
            question: "Growth hormones, such as HGH (Human Growth Hormone), are banned because they can cause abnormal growth of bones and tissues.",
            answer: true,
            explanation: "Human Growth Hormone (HGH) is banned because it can promote abnormal growth of bones, tissues, and organs, leading to serious health consequences. It is also used to improve muscle mass and recovery, which gives athletes an unfair advantage."
        },
        {
            question: "The stimulant ephedrine is not banned in sports.",
            answer: false,
            explanation: "Ephedrine is banned in sports due to its stimulant effects that can enhance performance, but it also poses significant health risks, including heart problems and increased blood pressure."
        },
        {
            question: "Beta-blockers, used to lower blood pressure, are banned in sports that require precision, such as archery or shooting.",
            answer: true,
            explanation: "Beta-blockers are banned in precision sports because they help reduce anxiety and tremors, improving performance in activities like archery, shooting, and diving. While they are beneficial for controlling blood pressure, they can provide an unfair advantage in these sports."
        },
        {
            question: "Creatine is a banned substance under anti-doping rules.",
            answer: false,
            explanation: "Creatine is a naturally occurring compound in the body that is used to improve energy production in muscles during short bursts of activity. It is not banned by anti-doping agencies and is commonly used by athletes to improve strength and muscle mass."
        },
        {
            question: "Narcotics like morphine are banned in all sports due to their performance-enhancing properties and health risks.",
            answer: true,
            explanation: "Narcotics like morphine are banned in sports because they can provide pain relief, allowing athletes to perform through injuries. However, they carry significant health risks, including addiction, respiratory depression, and long-term damage to the body."
        },
        {
            question: "Stimulants like methamphetamine can enhance concentration and physical performance, and they are not banned in all sports.",
            answer: false,
            explanation: "Methamphetamine is a powerful stimulant that can enhance concentration and physical performance. It is banned in all sports due to its high potential for abuse, serious health risks (including addiction, heart problems, and anxiety), and performance-enhancing effects."
        },
        {
            question: "Some vitamins and minerals can be banned if taken in excessive amounts, such as vitamin B12 or iron supplements.",
            answer: false,
            explanation: "Vitamins and minerals are not typically banned by anti-doping agencies, even if taken in large amounts. However, excessive intake may pose health risks, and athletes are advised to take supplements responsibly. There is no current evidence that specific vitamins like B12 or iron are banned in normal amounts."
        },
        {
            question: "Insulin is banned for use in sports because it can help athletes retain nutrients and improve recovery.",
            answer: true,
            explanation: "Insulin is banned in sports because it can be used to manipulate blood sugar levels, improve nutrient absorption, and aid recovery. While insulin is naturally produced by the body, its use as a performance enhancer is considered doping."
        },
        {
            question: "The use of alcohol as a performance-enhancing substance is banned in sports.",
            answer: false,
            explanation: "Alcohol is not generally banned in sports. However, it is prohibited in certain contexts, such as during competition or in sports where alcohol could affect performance, behavior, or safety. Its use is typically restricted by specific sport regulations."
        }
    ]
      }

  ];

  const selectCategory = (categoryIndex) => {
    setQuestions(categories[categoryIndex].questions);
    setCategorySelected(true);
  };

  const submitScore = async (finalScore) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        const userId = parsedData.id;

        const scoreData = {
          game_name: 'pillrace',
          score: finalScore,
          user_id: userId
        };

        const response = await axios.post('http://127.0.0.1:8000/game-scores', scoreData);
        Alert.alert('Score Submitted', `You scored ${finalScore} points!`);
        setHasSubmittedScore(true);
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      Alert.alert('Score Submission Failed', 'Please check your connection and try again.');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAnswer = (selectedAnswer) => {
    if (hasAnsweredCorrectly || isGameOver) return;

    const correctAnswer = questions[questionIndex].answer;

    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
      setAvatarPosition((prevPosition) => Math.min(prevPosition + MOVEMENT_INCREMENT, MAX_POSITION));
      setAnswerStatus("Yes, you are correct!");
      setShowExplanation(true);
      setHasAnsweredCorrectly(true);

      if (confettiRef.current) {
        confettiRef.current.start(); // Trigger confetti only on correct answer
      }
    } else {
      setScore(score - 1);
      setAvatarPosition((prevPosition) => Math.max(prevPosition - MOVEMENT_INCREMENT, MIN_POSITION));
      setAnswerStatus("No, you are wrong!");
      setShowExplanation(false);
    }
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setAnswerStatus("");
      setShowExplanation(false);
      setHasAnsweredCorrectly(false);
    } else {
      setIsGameOver(true);
      submitScore(score);
    }
  };

  const replayGame = () => {
    setScore(0);
    setQuestionIndex(0);
    setAnswerStatus("");
    setShowExplanation(false);
    setHasAnsweredCorrectly(false);
    setIsGameOver(false);
    setAvatarPosition(-44);
    setHasSubmittedScore(false);
    setIsInstructionsVisible(true); // Reset to show instructions before restarting
  };

  const totalScore = questions.length;

  const startGame = () => {
    setIsInstructionsVisible(false); // Hide instructions and start the game
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    {isInstructionsVisible ? (
  <View style={styles.instructionsContainer}>
    <View style={styles.rulesBox}>
      <Text style={styles.rulesTitle}>Game Rules</Text>
      <Text style={styles.instructionsText}>Welcome to the game! Ready for a <Text style={{ fontWeight: 'bold', color: '#336699' }}>fun challenge</Text>?</Text>
      <Text style={styles.instructionsText}>Select a <Text style={{ fontWeight: 'bold', color: '#336699' }}>category</Text> based on your interest. You'll face <Text style={{ fontWeight: 'bold', color: '#336699' }}>15 questions</Text> for each category, all in a <Text style={{ fontWeight: 'bold', color: '#336699' }}>True or False</Text> format.</Text>
      <Text style={styles.instructionsText}>Your goal is to <Text style={{ fontWeight: 'bold', color: '#336699' }}>move the ball</Text> and reach the <Text style={{ fontWeight: 'bold', color: '#336699' }}>podium</Text>!</Text>
      <Text style={styles.instructionsText}>For every <Text style={{ fontWeight: 'bold', color: '#336699' }}>correct answer</Text>, your <Text style={{ fontWeight: 'bold', color: '#336699' }}>score</Text> will increase and the ball will move one step forward. But be careful – answering incorrectly will <Text style={{ fontWeight: 'bold', color: '#336699' }}>reduce your score</Text> and send the ball <Text style={{ fontWeight: 'bold', color: '#336699' }}>backward</Text>.</Text>
      <Text style={styles.instructionsText}>The ball will only reach the <Text style={{ fontWeight: 'bold', color: '#336699' }}>podium</Text> if you answer all questions correctly. So give it your <Text style={{ fontWeight: 'bold', color: '#336699' }}>best shot</Text>! If you don't make it, don't worry – you can always <Text style={{ fontWeight: 'bold', color: '#336699' }}>try again</Text>!</Text>
      <Text style={styles.instructionsText}>Get ready to <Text style={{ fontWeight: 'bold', color: '#336699' }}>show off your knowledge</Text> and aim for the <Text style={{ fontWeight: 'bold', color: '#336699' }}>podium</Text>!</Text>
    </View>
    <TouchableOpacity style={styles.startButton} onPress={startGame}>
      <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Start Game</Text>
    </TouchableOpacity>
  </View>

      ) : categorySelected ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Journey to the Podium</Text>
            <Text style={styles.score}>Score: {score}/{totalScore}</Text>
          </View>

          <Canvas style={{ flex: 1 }} camera={{ position: [0, 5, 30], fov: 75, near: 0.1, far: 1000 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 10, 5]} />
            <OrbitControls enableZoom={false} enableRotate={false} />

            <mesh position={[35, 3, 0]}>
              <boxGeometry args={[10, 1, 10]} />
              <meshStandardMaterial color="gold" />
            </mesh>

            <mesh position={[avatarPosition, 4, 0]}>
              <sphereGeometry args={[2, 32, 32]} />
              <meshStandardMaterial color="blue" />
            </mesh>
          </Canvas>

          <View style={styles.questionContainer}>
            {!isGameOver ? (
              <>
                <Text style={styles.question}>{questions[questionIndex].question}</Text>

                <View style={styles.buttonGroup}>
                  <View style={styles.button}>
                    <Button title="True" onPress={() => handleAnswer(true)} disabled={hasAnsweredCorrectly} />
                  </View>
                  <View style={styles.button}>
                    <Button title="False" onPress={() => handleAnswer(false)} disabled={hasAnsweredCorrectly} />
                  </View>
                  {showExplanation && (
                    <View style={styles.button}>
                      <Button title="Next" onPress={nextQuestion} />
                    </View>
                  )}
                </View>

                {answerStatus && (
                  <Text style={styles.answerStatus}>{answerStatus}</Text>
                )}

                {showExplanation && (
                  <Text style={styles.explanation}>{questions[questionIndex].explanation}</Text>
                )}
              </>
            ) : (
              <View style={styles.gameOverContainer}>
                <Text style={styles.congratsText}>Awesome! You've successfully completed the game.</Text>
                <Text style={styles.finalScore}>Your final score is: {score}/{totalScore}</Text>
                {score === totalScore ? (
                  <Text style={styles.finalMessage}>Bravo! You nailed all the correct answers!</Text>
                ) : (
                  <Text style={styles.finalMessage}>Better luck next time!</Text>
                )}
                <View style={styles.button}>
                  <Button title="Replay" onPress={replayGame} />
                </View>
              </View>
            )}
          </View>
          {hasAnsweredCorrectly && !isGameOver &&  (
          <ConfettiCannon
          count={200}
          origin={{ x: 0.5, y: 0.5 }}
          fadeOut={true}
          ref={confettiRef}
          fallSpeed={3000}
        />

          )}
        </>
      ) : (
        <View style={styles.categorySelectionContainer}>
  <Text style={styles.categorySelectionHeader}>Select Category</Text>
  {categories.map((category, index) => (
    <TouchableOpacity key={index} style={styles.categoryButton} onPress={() => selectCategory(index)}>
      <Text style={styles.categoryButtonText}>
        {category.name} - <Text style={styles.categoryDescription}>{category.description}</Text>
      </Text>
    </TouchableOpacity>
  ))}
</View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({

  categorySelectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, // Space between header and category buttons
    color: 'yellow',
  },
  categorySelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282828',  // Dark background to keep focus
    padding: 20,
  },
  title: {
    color: '#fff',  // White title for contrast
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,  // Space between title and category buttons
    textAlign: 'center',
  },
  categoryButton: {
    width: '80%',
    paddingVertical: 15,
    marginVertical: 12,
    backgroundColor: '#007bff',  // Blue background for buttons
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,  // Adds a subtle shadow effect for depth
    borderWidth: 1,
    borderColor: '#0056b3',  // Darker blue border on hover or focus
  },
  categoryDescription: {
    fontSize: 15,
    color: '#ddd',
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',  // Bold text to stand out
  },
  categoryButtonPressed: {
    backgroundColor: '#0056b3',  // Darker blue when pressed
    borderColor: '#003f7f',  // Darker border color on press
  },
  categoryButtonContainer: {
    flexDirection: 'column',  // Stack buttons vertically
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: '50%',
    transform: [{translateY: -12}],
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    color: "white",
  },
  score: {
    fontSize: 18,
    color: "white",
  },
  questionContainer: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    borderRadius: 10,
  },
  instructionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282828', // Grey background for the main container
    padding: 20,
  },
  rulesBox: {
    backgroundColor: '#fff',  // White background for the rule box
    borderRadius: 10,  // Rounded corners for the box
    padding: 20,  // Padding inside the box
    shadowColor: '#000', // Shadow for floating effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 20,  // Space below the rule box
    width: '90%', // Box width relative to the screen
  },
  rulesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Black color for the title
    marginBottom: 15,  // Space below the title
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 18,
    color: '#000',  // Black color for the text
    marginVertical: 10,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#007BFF', // Blue color for the start button
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
  },
  header: {
    padding: 20,
    backgroundColor: "#282c34",
    alignItems: "center",
    position: 'relative',
  },
  question: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  explanation: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    fontStyle: "italic",
  },
  answerStatus: {
    color: "yellow",
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
  },
  gameOverContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  congratsText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  finalScore: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  finalMessage: {
    fontSize: 15,
    color: "yellow",
    fontWeight: "bold",
    marginBottom: 20,
  },
});


