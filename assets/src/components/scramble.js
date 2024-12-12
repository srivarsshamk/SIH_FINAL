import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const App = ({ navigation }) => {
  const categories = {
    "Banned Substances": [
      {
        scrambled: "OTSREDIS",
        hint: "Enhances muscle growth and performance.",
        answer: "Steroids",
        detail: "Steroids are synthetic substances similar to the male hormone testosterone. While they can be prescribed for medical conditions, anabolic steroids are commonly abused in sports to build muscle mass and improve performance, leading to severe health risks."
      },
      {
        scrambled: "POTEIRYHNORTI",
        hint: "Boosts red blood cell production.",
        answer: "Erythropoietin",
        detail: "Often abbreviated as EPO, this hormone is used medically to treat anemia but is misused in sports to increase oxygen delivery to muscles, enhancing endurance. Abuse can cause blood thickening, increasing the risk of stroke or heart attack."
      },
      {
        scrambled: "AHPEMNASTIME",
        hint: "Stimulant for alertness and focus.",
        answer: "Amphetamines",
        detail: "Amphetamines are central nervous system stimulants that increase energy and concentration. Illicit use in sports can lead to addiction, high blood pressure, and even cardiovascular failure."
      },
      {
        scrambled: "ICTUREIDS",
        hint: "Used to flush out substances from the body.",
        answer: "Diuretics",
        detail: "Diuretics increase urine production, often used to mask the presence of other banned substances in doping tests. They can lead to severe dehydration and electrolyte imbalance."
      },
      {
        scrambled: "OBLINCAA",
        hint: "Related to muscle-building steroids.",
        answer: "Anabolic",
        detail: "Anabolic substances promote muscle growth and physical strength. Their abuse can cause liver damage, hormonal imbalances, and psychiatric effects such as aggression."
      },
      {
        scrambled: "NCBNIAOSADNI",
        hint: "Found in marijuana and hemp.",
        answer: "Cannabinoids",
        detail: "Cannabinoids like THC affect the central nervous system, impairing coordination and judgment. They are prohibited in sports as they may impact performance or recovery negatively."
      },
      {
        scrambled: "ACORNITCS",
        hint: "Pain-relieving substances.",
        answer: "Narcotics",
        detail: "Narcotics like morphine and fentanyl are prescribed for severe pain but are banned in sports due to their potential for addiction and their performance-altering effects."
      },
      {
        scrambled: "TULMSNIIAT",
        hint: "Boosts energy and reduces fatigue.",
        answer: "Stimulants",
        detail: "Stimulants increase heart rate, alertness, and energy. Common examples include caffeine and ephedrine, but misuse can lead to heart problems, anxiety, and dependency."
      },
      {
        scrambled: "MONEOSRH",
        hint: "Naturally occurring substances in the body.",
        answer: "Hormones",
        detail: "Hormones like growth hormone and testosterone are often abused to enhance physical abilities. Misuse can cause hormonal imbalances and long-term organ damage."
      },
      {
        scrambled: "ELACTORKBBE",
        hint: "Reduces anxiety and heart rate.",
        answer: "Beta-blockers",
        detail: "Beta-blockers are used in sports requiring steadiness and focus, like archery or shooting. They are banned as they provide an unfair advantage by calming nerves and lowering blood pressure."
      },
      {
        scrambled: "NILUNIS",
        hint: "Regulates blood sugar.",
        answer: "Insulin",
        detail: "While crucial for diabetes management, insulin is abused in sports for its anabolic effects. Misuse can result in severe hypoglycemia, potentially fatal."
      },
      {
        scrambled: "ROHEMPIN",
        hint: "A strong painkiller derived from opium.",
        answer: "Morphine",
        detail: "Morphine is a potent narcotic used medically to manage pain but is banned in sports due to its euphoric and performance-altering properties."
      },
      {
        scrambled: "ELUCLTBERNO",
        hint: "Sometimes called a 'fat burner.'",
        answer: "Clenbuterol",
        detail: "Clenbuterol is used illegally for weight loss and muscle preservation. It can cause tremors, palpitations, and long-term cardiovascular issues."
      },
      {
        scrambled: "DERTICROOSSTO",
        hint: "Treats inflammation and allergies.",
        answer: "Corticosteroids",
        detail: "These are anti-inflammatory drugs used for conditions like asthma. Abuse in sports can mask pain or injuries, potentially worsening the athlete's condition."
      },
      {
        scrambled: "SSOOTTERENE",
        hint: "A primary male sex hormone.",
        answer: "Testosterone",
        detail: "Testosterone is naturally produced in the body but is banned when artificially taken to boost muscle mass and strength. Overuse can lead to severe cardiovascular, liver, and reproductive health issues."
      }
    ],

    "Testing Procedures": [
    {
      scrambled: "OLBDO",
      hint: "A primary fluid tested for doping substances.",
      answer: "Blood",
      detail: "Blood testing is used to detect banned substances like EPO or blood doping practices. It provides critical data about an athlete's physiological state, making it an essential part of anti-doping measures."
    },
    {
      scrambled: "NUIRE",
      hint: "The most common sample for anti-doping tests.",
      answer: "Urine",
      detail: "Urine samples are analyzed to detect the presence of banned substances or their metabolites. This method is widely used due to its non-invasive nature and the ability to detect a broad range of substances."
    },
    {
      scrambled: "PODNIG",
      hint: "The act of using prohibited substances or methods.",
      answer: "Doping",
      detail: "Doping refers to the illegal use of substances or methods to enhance athletic performance. It undermines fair play and poses serious health risks to athletes."
    },
    {
      scrambled: "MALSEP",
      hint: "A biological material collected for testing.",
      answer: "Sample",
      detail: "Samples such as blood or urine are collected from athletes to test for banned substances. Proper handling and documentation ensure the integrity of the testing process."
    },
    {
      scrambled: "CTIOLCEOLN",
      hint: "The process of obtaining biological samples.",
      answer: "Collection",
      detail: "Sample collection involves strict protocols to prevent tampering or contamination. This includes supervision during sample provision and secure storage for transport to a laboratory."
    },
    {
      scrambled: "RBAALORYOT",
      hint: "The facility where samples are analyzed.",
      answer: "Laboratory",
      detail: "Accredited laboratories analyze samples for banned substances. They follow the World Anti-Doping Agency (WADA) guidelines to ensure accurate and reliable results."
    },
    {
      scrambled: "HALETE",
      hint: "The individual being tested.",
      answer: "Athlete",
      detail: "Athletes are subject to testing under anti-doping regulations. They must provide accurate whereabouts information and comply with testing requests at any time."
    },
    {
      scrambled: "OSPTSRPA",
      hint: "A long-term record of biological markers.",
      answer: "Passport",
      detail: "The Athlete Biological Passport (ABP) monitors markers in an athlete's blood and urine over time. It helps detect doping by identifying abnormal changes indicative of substance use."
    },
    {
      scrambled: "CNAHI",
      hint: "Ensures sample integrity during handling.",
      answer: "Chain",
      detail: "The chain of custody refers to the documentation and tracking of a sample from collection to analysis. It ensures that the sample has not been tampered with or mishandled."
    },
    {
      scrambled: "CUTSDOY",
      hint: "Secures samples during transit.",
      answer: "Custody",
      detail: "Custody involves securing and documenting the movement of samples to prevent unauthorized access or tampering. It is crucial for maintaining the integrity of test results."
    },
    {
      scrambled: "ADSEVR",
      hint: "Indicates a potential rule violation.",
      answer: "Adverse",
      detail: "An Adverse Analytical Finding (AAF) is reported when banned substances or markers are detected in an athlete's sample. This can lead to further investigation or sanctions."
    },
    {
      scrambled: "LANALITYAC",
      hint: "The process of examining a sample.",
      answer: "Analytical",
      detail: "Analytical procedures involve testing samples for prohibited substances. It requires precise equipment and expertise to ensure accurate results."
    },
    {
      scrambled: "RROEPT",
      hint: "A formal document with testing outcomes.",
      answer: "Report",
      detail: "After analysis, a report is generated detailing the findings. It serves as the basis for decisions about potential doping violations and subsequent actions."
    },
    {
      scrambled: "GIREAPMTN",
      hint: "Interfering with the testing process.",
      answer: "Tampering",
      detail: "Tampering refers to altering or interfering with the doping control process. It is a serious violation of anti-doping regulations and can result in significant penalties."
    },
    {
      scrambled: "NIFDENTIICTAIO",
      hint: "Verifying the athlete's identity during testing.",
      answer: "Identification",
      detail: "Identification ensures the correct athlete is being tested. It involves verifying documents like photo IDs to maintain accuracy and fairness in the anti-doping process."
    }
  ],

    "Anti-Doping Organisations": [
    {
      scrambled: "DAWA",
      hint: "Global leader in anti-doping initiatives.",
      answer: "WADA (World Anti-Doping Agency)",
      detail: "WADA, founded in 1999, is the international organization responsible for promoting, coordinating, and monitoring anti-doping efforts globally. It develops and enforces the World Anti-Doping Code, which sets the rules for doping control in sports."
    },
    {
      scrambled: "SUAAD",
      hint: "Anti-doping body for American athletes.",
      answer: "USADA (United States Anti-Doping Agency)",
      detail: "USADA oversees anti-doping programs in the United States. It handles testing, education, research, and adjudication to protect clean athletes and uphold the integrity of sports within the U.S."
    },
    {
      scrambled: "ADAN",
      hint: "Responsible for anti-doping measures in a specific country.",
      answer: "NADA (National Anti-Doping Agency)",
      detail: "NADA operates at the national level in various countries to enforce anti-doping policies, conduct testing, and educate athletes. It ensures compliance with WADA’s global standards within its jurisdiction."
    },
    {
      scrambled: "OIC",
      hint: "Governs the Olympic Games.",
      answer: "IOC (International Olympic Committee)",
      detail: "The IOC works closely with WADA to implement anti-doping rules during the Olympics. It ensures fair play and the protection of athletes by enforcing stringent anti-doping measures at the Games."
    },
    {
      scrambled: "FFAI",
      hint: "Governing body for global football (soccer).",
      answer: "FIFA",
      detail: "FIFA, in collaboration with WADA, conducts anti-doping programs to keep football clean. It implements testing, education, and sanctioning procedures to prevent doping in the sport."
    },
    {
      scrambled: "CCI",
      hint: "Governs international cricket.",
      answer: "ICC (International Cricket Council)",
      detail: "The ICC is responsible for maintaining anti-doping standards in cricket. It collaborates with WADA and national agencies to test players and ensure fair play across all cricket formats."
    },
    {
      scrambled: "TFI",
      hint: "Governs international tennis.",
      answer: "ITF (International Tennis Federation)",
      detail: "ITF enforces anti-doping policies in tennis, conducting in-competition and out-of-competition testing. It works to ensure tennis remains a clean sport, free from performance-enhancing substances."
    },
    {
      scrambled: "ANFI",
      hint: "Governs aquatic sports worldwide.",
      answer: "FINA (Swimming Federation)",
      detail: "FINA oversees swimming, diving, and water polo, ensuring compliance with anti-doping standards. It collaborates with WADA to conduct rigorous testing and promote clean sport values."
    },
    {
      scrambled: "FAI",
      hint: "World Athletics governing body.",
      answer: "IAAF (Athletics Federation)",
      detail: "The IAAF, now known as World Athletics, leads anti-doping efforts in track and field events. It ensures fair competition by conducting regular and random testing of athletes globally."
    },
    {
      scrambled: "WBF",
      hint: "Governs badminton worldwide.",
      answer: "BWF (Badminton Federation)",
      detail: "The Badminton World Federation (BWF) implements anti-doping policies in the sport. It educates players on clean sport principles and tests for banned substances during tournaments."
    },
    {
      scrambled: "SAC",
      hint: "Resolves disputes in sports, including doping cases.",
      answer: "CAS (Court of Arbitration for Sport)",
      detail: "CAS is an independent body that handles legal disputes in sports, including doping violations. It ensures that athletes and organizations receive fair and impartial hearings."
    },
    {
      scrambled: "ECNOUS",
      hint: "Promotes education and ethical sport values.",
      answer: "UNESCO",
      detail: "UNESCO supports anti-doping education programs worldwide. Its International Convention Against Doping in Sport provides a legal framework for governments to align with WADA standards."
    },
    {
      scrambled: "PEILMNOACC",
      hint: "Following anti-doping rules and standards.",
      answer: "Compliance",
      detail: "Compliance involves adhering to WADA's World Anti-Doping Code. Organizations, athletes, and stakeholders must follow these rules to ensure a fair and level playing field in sports."
    },
    {
      scrambled: "CDOE",
      hint: "The fundamental document for anti-doping.",
      answer: "Code",
      detail: "The World Anti-Doping Code is the core framework that outlines the principles, policies, and procedures for combating doping. It is binding on all sports and countries that adhere to WADA."
    },
    {
      scrambled: "COYILP",
      hint: "A plan of action for anti-doping measures.",
      answer: "Policy",
      detail: "Anti-doping policies guide how organizations implement testing, education, and enforcement. These policies are aligned with WADA’s Code to maintain consistency across the globe."
    }
  ],
  "Doping Consequences": [
    {
      scrambled: "SUPNOSESNI",
      hint: "A temporary prohibition from participating in sports.",
      answer: "Suspension",
      detail: "Suspension is a common consequence of doping violations. Athletes are barred from competition for a specific period while investigations are conducted or as a penalty for confirmed doping offenses."
    },
    {
      scrambled: "NAB",
      hint: "A more severe prohibition than a suspension.",
      answer: "Ban",
      detail: "A ban is a formal exclusion from all sports activities, often for a significant duration. Bans can be career-ending for severe violations, emphasizing the gravity of doping."
    },
    {
      scrambled: "IFEN",
      hint: "A monetary penalty imposed on offenders.",
      answer: "Fine",
      detail: "Athletes or organizations may be fined for violations such as doping. These financial penalties aim to discourage rule-breaking and compensate for the administrative costs of investigations."
    },
    {
      scrambled: "PNTUROAEIT",
      hint: "A valuable asset that can be permanently damaged.",
      answer: "Reputation",
      detail: "Doping tarnishes an athlete's reputation, leading to loss of respect from fans, peers, and sponsors. It can negatively affect future opportunities, even after serving penalties."
    },
    {
      scrambled: "HLATEH",
      hint: "Doping poses significant risks to this aspect of an athlete’s life.",
      answer: "Health",
      detail: "Many doping substances have severe health consequences, including organ damage, hormonal imbalance, and increased risk of mental health issues. Long-term use can lead to chronic illnesses or premature death."
    },
    {
      scrambled: "CRRAEE",
      hint: "Doping often leads to the end of this professional journey.",
      answer: "Career",
      detail: "An athlete's career can be irreversibly harmed by doping violations. Loss of credibility, sponsors, and the inability to compete are common outcomes, making it difficult to rebuild their profession."
    },
    {
      scrambled: "GALLE",
      hint: "Doping violations can result in trouble with the law.",
      answer: "Legal",
      detail: "Legal consequences may arise, especially if doping involves trafficking, possession, or use of prohibited substances in jurisdictions where such activities are criminal offenses."
    },
    {
      scrambled: "QDAULFISIITCON",
      hint: "Being removed from an event or losing awards.",
      answer: "Disqualification",
      detail: "Athletes found guilty of doping may be disqualified from competitions, losing their titles, medals, and records. Disqualification can be retroactive, impacting past achievements."
    },
    {
      scrambled: "TSETGIN",
      hint: "A process that identifies doping violations.",
      answer: "Testing",
      detail: "Failing a doping test often triggers consequences such as suspensions or bans. Testing ensures fairness and serves as a deterrent against the use of prohibited substances."
    },
    {
      scrambled: "EVRIECTREPSOT",
      hint: "Doping violations may be discovered long after an event.",
      answer: "Retrospective",
      detail: "Retrospective testing of stored samples can reveal doping offenses years later. This ensures that cheaters are eventually caught, even if their violation initially went undetected."
    },
    {
      scrambled: "OCPFERNAMRE",
      hint: "The primary aspect of competition affected by doping.",
      answer: "Performance",
      detail: "Doping artificially enhances performance, undermining fair play. While it may offer short-term gains, the long-term consequences often outweigh these temporary benefits."
    },
    {
      scrambled: "OLSS",
      hint: "Doping often leads to forfeiture of achievements.",
      answer: "Loss",
      detail: "Athletes may lose medals, titles, and records if found guilty of doping. These losses are a significant blow to an athlete’s legacy and morale."
    },
    {
      scrambled: "SNIOCSATN",
      hint: "Measures taken to penalize doping violations.",
      answer: "Sanctions",
      detail: "Sanctions include suspensions, bans, fines, and disqualifications. They aim to uphold the integrity of sports and deter future violations by setting an example."
    },
    {
      scrambled: "CNORVAEOTI",
      hint: "The formal withdrawal of titles or awards.",
      answer: "Revocation",
      detail: "Revocation is the stripping of titles, records, or medals due to doping violations. It is often accompanied by public announcements to maintain transparency."
    },
    {
      scrambled: "YAOOLPG",
      hint: "A public expression of regret by the athlete.",
      answer: "Apology",
      detail: "Athletes found guilty often issue apologies to their fans, teams, and governing bodies. While it can help repair their image slightly, the damage to trust and reputation is often long-lasting."
    }
  ],

  "Clean Sport Values": [
    {
      scrambled: "YITGRNITE",
      hint: "Adherence to moral principles and honesty.",
      answer: "Integrity",
      detail: "Integrity in sport means being honest, transparent, and upholding the highest ethical standards. Athletes and officials who display integrity prioritize fairness and strive to do the right thing, even when no one is watching."
    },
    {
      scrambled: "SFAIRNSE",
      hint: "Treating all participants equally and without bias.",
      answer: "Fairness",
      detail: "Fairness ensures that all athletes compete under the same conditions and are judged impartially. In clean sport, fairness involves preventing any form of cheating, including doping, to ensure that victory is earned through legitimate efforts."
    },
    {
      scrambled: "YHSOENT",
      hint: "Truthfulness in actions and words.",
      answer: "Honesty",
      detail: "Honesty in sport means being truthful in all aspects, from acknowledging one's achievements to admitting mistakes or violations. It fosters trust between athletes, coaches, and fans and helps maintain the integrity of sports."
    },
    {
      scrambled: "HLATEH",
      hint: "A crucial aspect of an athlete’s well-being and performance.",
      answer: "Health",
      detail: "Clean sport promotes physical and mental health by preventing harmful doping practices. It emphasizes the importance of maintaining a healthy body through proper training, nutrition, and recovery, free from performance-enhancing substances."
    },
    {
      scrambled: "REPTSEC",
      hint: "Valuing others’ rights, feelings, and contributions.",
      answer: "Respect",
      detail: "Respect in sport means valuing opponents, officials, teammates, and the rules of the game. It involves showing sportsmanship by competing in a fair and dignified manner, acknowledging the achievements of others, and behaving ethically."
    },
    {
      scrambled: "ONHR",
      hint: "Upholding moral principles and gaining recognition through good actions.",
      answer: "Honor",
      detail: "Honor in sport is about acting with dignity, fairness, and respect. Athletes who compete honorably maintain the true spirit of the game and inspire others by demonstrating high ethical standards in every competition."
    },
    {
      scrambled: "EXLENCXE",
      hint: "Striving for the highest standards in every performance.",
      answer: "Excellence",
      detail: "Excellence is the pursuit of greatness through dedication and hard work. Clean sport values excellence by encouraging athletes to improve continuously through fair and honest efforts, without resorting to shortcuts like doping."
    },
    {
      scrambled: "RNEARNTYPASC",
      hint: "Openness and clarity in actions and decisions.",
      answer: "Transparency",
      detail: "Transparency in clean sport involves clear communication, openness about doping control procedures, and the public disclosure of results. It ensures that decisions are made fairly and that the processes are accessible for scrutiny by the public and stakeholders."
    },
    {
      scrambled: "QLAAITYE",
      hint: "Providing equal opportunities and treatment for everyone.",
      answer: "Equality",
      detail: "Equality in sport means that every athlete, regardless of their background, race, gender, or country, has the same opportunities and is treated with equal respect. It promotes inclusion and ensures a level playing field in all competitions."
    },
    {
      scrambled: "CTEHIS",
      hint: "Principles that guide behavior in sports.",
      answer: "Ethics",
      detail: "Ethics in sport refers to the moral principles that guide athletes' actions, such as playing fairly, respecting the rules, and refraining from doping. Ethical behavior is essential in promoting trust and respect within the sporting community."
    },
    {
      scrambled: "TSPIRI",
      hint: "The positive energy and enthusiasm that drives athletes.",
      answer: "Spirit",
      detail: "The spirit of sport involves the passion, commitment, and enjoyment that athletes bring to their competition. It’s about competing with vigor and determination, while also adhering to the values of fairness, respect, and integrity."
    },
    {
      scrambled: "RUTHT",
      hint: "Accuracy and honesty in every aspect of sport.",
      answer: "Truth",
      detail: "Truth in sport refers to the commitment to honesty in competition, representation, and communication. It is the foundation for building trust and credibility, ensuring that all actions are transparent and that athletes adhere to the true spirit of competition."
    },
    {
      scrambled: "IUNTY",
      hint: "Coming together for a common goal or purpose.",
      answer: "Unity",
      detail: "Unity in sport emphasizes working together as a team, both on and off the field. It involves collaboration and mutual respect, fostering a sense of belonging and shared purpose that transcends individual achievements."
    },
    {
      scrambled: "CEDDIATOIN",
      hint: "Commitment and hard work towards achieving a goal.",
      answer: "Dedication",
      detail: "Dedication in sport means committing oneself fully to improvement and success, including adhering to the clean sport principles. It’s about consistent effort, training, and perseverance to achieve peak performance without compromising integrity."
    },
    {
      scrambled: "NBTYAAUILCAO",
      hint: "Taking responsibility for one’s actions.",
      answer: "Accountability",
      detail: "Accountability in sport means taking responsibility for one’s actions and decisions. Athletes, coaches, and officials are accountable for maintaining fair play, following anti-doping rules, and ensuring that they uphold the integrity of the sport."
    }
  ],

  "Famous Sportspersons (Anti-Doping Advocates)": [
    {
      scrambled: "INSUA BLOT",
      hint: "World-renowned Jamaican sprinter, known for his speed and anti-doping stance.",
      answer: "Usain Bolt",
      detail: "Usain Bolt is considered one of the greatest sprinters of all time, holding world records in the 100m and 200m. Throughout his career, he has been a strong advocate for clean sport and has spoken out against doping, encouraging fair competition in athletics."
    },
    {
      scrambled: "EERNA SAWILMS",
      hint: "American tennis legend with a powerful voice against doping.",
      answer: "Serena Williams",
      detail: "Serena Williams is one of the most decorated female tennis players in history. She has been vocal about clean sport and supporting anti-doping efforts, emphasizing the importance of fair play and athlete integrity in tennis."
    },
    {
      scrambled: "HLPMICE PELHS",
      hint: "Legendary American swimmer, known for his 23 Olympic gold medals.",
      answer: "Michael Phelps",
      detail: "Michael Phelps is the most decorated Olympian of all time, winning 23 gold medals in swimming. As an advocate for clean sport, he has raised awareness about mental health and doping, urging athletes to compete fairly and responsibly."
    },
    {
      scrambled: "AALFER NADL",
      hint: "Spanish tennis champion who is outspoken against doping.",
      answer: "Rafael Nadal",
      detail: "Rafael Nadal is a highly successful tennis player with numerous Grand Slam titles. Known for his intense work ethic and commitment to fair play, Nadal has consistently rejected doping and has supported measures to ensure clean sport in tennis."
    },
    {
      scrambled: "MEONIS SBILE",
      hint: "American gymnast and outspoken advocate for clean sport.",
      answer: "Simone Biles",
      detail: "Simone Biles is widely regarded as one of the greatest gymnasts of all time. She has been an advocate for clean sport, speaking out about the pressures athletes face and supporting anti-doping policies to ensure a fair environment for all athletes."
    },
    {
      scrambled: "OGERR FDEER",
      hint: "Swiss tennis icon known for his sportsmanship and integrity.",
      answer: "Roger Federer",
      detail: "Roger Federer is one of the most respected tennis players in history, with 20 Grand Slam titles. Federer is a strong advocate for clean sport and has consistently emphasized the importance of competing fairly and maintaining integrity in all sports."
    },
    {
      scrambled: "AONMI OSAKA",
      hint: "Japanese tennis star known for her advocacy and focus on mental health.",
      answer: "Naomi Osaka",
      detail: "Naomi Osaka has quickly risen to the top ranks of tennis and is known for her activism in advocating for mental health and clean sport. She has been vocal about the importance of protecting athletes from doping pressures and promoting a fair and honest sporting environment."
    },
    {
      scrambled: "LIDEU KPECHOIG",
      hint: "Kenyan marathoner who holds the world record for the marathon.",
      answer: "Eliud Kipchoge",
      detail: "Eliud Kipchoge is regarded as the greatest marathoner in history, having broken the marathon world record. He is a strong advocate for clean sport and regularly speaks about the importance of discipline, fair play, and maintaining integrity in athletics."
    },
    {
      scrambled: "LAYSON ALFIXE",
      hint: "American sprinter and advocate for clean sport and maternal health.",
      answer: "Allyson Felix",
      detail: "Allyson Felix is one of the most successful American sprinters, with numerous Olympic and World Championship medals. She has consistently advocated for clean sport, pushing for anti-doping reforms and championing the importance of clean competition in athletics."
    },
    {
      scrambled: "AVOKN DJOICV",
      hint: "Serbian tennis player, known for his championships and anti-doping advocacy.",
      answer: "Novak Djokovic",
      detail: "Novak Djokovic is one of the top male tennis players, known for his incredible success on the court. Djokovic has been a vocal advocate for anti-doping efforts, promoting clean sport and speaking out against performance-enhancing drugs in tennis and other sports."
    },
    {
      scrambled: "NOILEL MSSEI",
      hint: "Argentinian football superstar, recognized for his fair play and integrity.",
      answer: "Lionel Messi",
      detail: "Lionel Messi is considered one of the greatest footballers of all time. Throughout his career, Messi has been a proponent of clean sport, emphasizing fair play and sportsmanship, and staying away from doping-related controversies."
    },
    {
      scrambled: "NIOTCIRA NLORADO",
      hint: "Portuguese football icon and advocate for anti-doping measures.",
      answer: "Cristiano Ronaldo",
      detail: "Cristiano Ronaldo is one of the most famous and successful footballers globally. Known for his discipline and physical prowess, Ronaldo is a strong advocate for clean sport, speaking out against doping and promoting ethical practices in sports."
    },
    {
      scrambled: "TKAEI LEDYCK",
      hint: "American swimmer, Olympic gold medalist, and anti-doping supporter.",
      answer: "Katie Ledecky",
      detail: "Katie Ledecky is one of the most successful swimmers in history, with multiple Olympic gold medals. She advocates for clean sport and has expressed strong support for anti-doping measures to protect the integrity of swimming and other sports."
    },
    {
      scrambled: "INASA NEHWAL",
      hint: "Indian badminton player, an advocate for fair play and integrity in sport.",
      answer: "Saina Nehwal",
      detail: "Saina Nehwal is one of India's most prominent badminton players, having won numerous international titles. She has been a strong supporter of clean sport and anti-doping policies, ensuring the integrity of her sport and encouraging young athletes to compete fairly."
    },
    {
      scrambled: "NELORB JAMSE",
      hint: "American basketball superstar, an advocate for social causes and clean sport.",
      answer: "LeBron James",
      detail: "LeBron James is widely considered one of the greatest basketball players of all time. Throughout his career, he has emphasized the importance of clean sport, advocating against doping and promoting fairness and transparency in professional basketball."
    }
  ]
  };

  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [scrambleData, setScrambleData] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [answerStatus, setAnswerStatus] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef(null);

  const startGame = (category) => {
    setSelectedCategory(category);
    setScrambleData(categories[category]);
    setGameStarted(true);
  };

  const checkAnswer = () => {
    const currentWord = scrambleData[currentWordIndex];
    if (input.trim().toUpperCase() === currentWord.answer.toUpperCase()) {
      setAnswerStatus({ type: 'correct', message: "Correct! You've got it right!" });
      setShowDetail(true);
      setShowConfetti(true);
      if (confettiRef.current) {
        confettiRef.current.start();
      }
    } else {
      setAnswerStatus({ type: 'incorrect', message: "Try Again. That's not the correct answer." });
    }
  };

  const nextWord = () => {
    if (currentWordIndex < scrambleData.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setInput('');
      setShowHint(false);
      setAnswerStatus('');
      setShowDetail(false);
      setShowConfetti(false);
    } else {
      setAnswerStatus({ type: 'completed', message: "Well Done! You've completed all the words!" });
    }
  };

  const gameInstructions = (
    <View style={styles.instructionsContainer}>
      <Text style={styles.instructionsTitle}>Instructions:</Text>
      <Text style={styles.instructionsText}>1. Unscramble the word shown.</Text>
      <Text style={styles.instructionsText}>2. Type your answer and click 'Submit'.</Text>
      <Text style={styles.instructionsText}>3. You can use 'Show Hint' for a hint.</Text>
      <Text style={styles.instructionsText}>4. Click 'Next Word' to move to the next word after answering.</Text>
    </View>
  );

  return (
    <View style={styles.background}>
      {!gameStarted ? (
        <View style={styles.container}>
          <Text style={styles.title}>Select a Category</Text>
          <FlatList
            data={Object.keys(categories)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.categoryButton} onPress={() => startGame(item)}>
                <Text style={styles.categoryText}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.categoryList}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>{selectedCategory} - Word Scramble</Text>
          <Text style={styles.scrambledText}>{scrambleData[currentWordIndex].scrambled}</Text>

          {showHint && (
            <Text style={styles.hint}>Hint: {scrambleData[currentWordIndex].hint}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Your answer here"
            placeholderTextColor="#aaa"
            value={input}
            onChangeText={setInput}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setShowHint(!showHint)}>
              <Text style={styles.buttonText}>{showHint ? 'Hide Hint' : 'Show Hint'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={checkAnswer}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={nextWord}>
              <Text style={styles.buttonText}>Next Word</Text>
            </TouchableOpacity>
          </View>

          {answerStatus && (
            <Text style={[
              styles.answerStatus,
              answerStatus.type === 'correct' && styles.correctAnswer,
              answerStatus.type === 'completed' && styles.completed
            ]}>
              {answerStatus.message}
            </Text>
          )}

          {showDetail ? (
            <View style={styles.detailContainer}>
              <Text style={styles.detailTitle}>Word Details:</Text>
              <Text style={styles.detailText}>{scrambleData[currentWordIndex].detail}</Text>
            </View>
          ) : gameInstructions}

          <ConfettiCannon
            ref={confettiRef}
            count={300}
            origin={{ x: -10, y: 0 }}
            autoStart={showConfetti}
            fadeOut={true}
            fallSpeed={3000}
            explosionSpeed={350}
            colors={['#FF5733', '#FFC300', '#DAF7A6', '#33FFBD', '#3380FF', '#AF33FF']}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // ... same styles as before with categoryButton and categoryText added ...
  categoryButton: {
    backgroundColor: '#33FFBD',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03615b',
    textAlign: 'center',
  },
  categoryList: {
    paddingVertical: 20,
  },
  background: {
    flex: 1,
    backgroundColor: '#03615b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#000',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    height: '81%', // Ensuring it covers the entire black container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  gameContentContainer: {
    flex: 1, // Make sure content fills the space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 25, // Increased font size for the title
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrambledText: {
    fontSize: 40, // Increased font size for scrambled word
    fontWeight: 'bold',
    color: '#33FFBD',
    textAlign: 'center',
    marginBottom: 20,
  },
  hint: {
    fontSize: 20, // Increased font size for hint
    color: '#DAF7A6',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50, // Increased input box size
    borderColor: '#33FFBD',
    borderWidth: 1,
    borderRadius: 10, // Rounded corners for input box
    width: '100%',
    padding: 15, // Increased padding for better visibility
    marginBottom: 30, // Added margin at the bottom for spacing
    color: '#fff',
    backgroundColor: '#222',
    fontSize: 20, // Increased font size inside the input box
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30, // Increased bottom margin for spacing
    gap: 20, // Increased gap between buttons
    width: '100%', // Make buttons span the entire width of the container
  },
  button: {
    backgroundColor: '#33FFBD',
    paddingVertical: 15, // Increased button padding for larger size
    paddingHorizontal: 25, // Increased horizontal padding for larger buttons
    borderRadius: 10, // Rounded corners for buttons
    minWidth: 120, // Minimum width for buttons
  },
  instructionsContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#222',
    borderRadius: 15,
    width: '100%', // Make detail container span the entire width
  },
  instructionsText: {
    fontSize: 18, // Increased font size for detail text
    color: '#DAF7A6',
    lineHeight: 28, // Increased line height for better readability
  },
  instructionsTitle: {
    fontSize: 22, // Increased font size for detail title
    fontWeight: 'bold',
    color: '#FFC300',
    marginBottom: 10,
  },
  buttonText: {
    color: '#03615b',
    fontSize: 20, // Increased font size for button text
    textAlign: 'center',
  },
  answerStatus: {
    fontSize: 20, // Increased font size for answer status
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  correctAnswer: {
    color: '#33FFBD',
  },
  completed: {
    color: '#FFC300',
    fontSize: 25, // Increased font size for completed message
  },
  detailContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#222',
    borderRadius: 15,
    width: '100%', // Make detail container span the entire width
  },
  detailTitle: {
    fontSize: 22, // Increased font size for detail title
    fontWeight: 'bold',
    color: '#FFC300',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 18, // Increased font size for detail text
    color: '#DAF7A6',
    lineHeight: 28, // Increased line height for better readability
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 8,
    zIndex: 1,
  },
});

export default App;


