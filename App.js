import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./assets/src/screens/LoginScreen";
import HomeScreen from "./assets/src/screens/homescreen";
import HomeCoachScreen from "./assets/src/screens/home_coach";
import HomeExpertScreen from "./assets/src/screens/home_expert";
import GameScreen from "./assets/src/screens/gamescreen";
import Hangman from "./assets/src/components/hangman";
import Sort from "./assets/src/components/sort";
import Scramble from "./assets/src/components/scramble";
import Quiz from "./assets/src/components/quiz";
import CrosswordGame from "./assets/src/components/crossword";
import MemoryGame from "./assets/src/components/memory";
import PillRace from "./assets/src/components/pillrace";
import ProfilePage from "./assets/src/screens/profilescreen";
import SignupScreen from "./assets/src/screens/signupscreen";
import Post from "./assets/src/screens/post";
import CrosswordRulesScreen from "./assets/src/components/crosswordrules";
import CrosswordGame1 from "./assets/src/components/crossword1";
import CrosswordGame2 from "./assets/src/components/crossword2";
import CrosswordGame3 from "./assets/src/components/crossword3";
import CrosswordLevelSelector from "./assets/src/components/crosswordlevel";
import QuizRulesScreen from "./assets/src/components/quizrules";
import CategorySelectionScreen from "./assets/src/components/quizcategory";
import Quiz1 from "./assets/src/components/quiz1";
import Quiz2 from "./assets/src/components/quiz2";
import Quiz3 from "./assets/src/components/quiz3";
import Hangman1 from "./assets/src/components/hangman1";
import Hangman2 from "./assets/src/components/hangman2";
import Hangman3 from "./assets/src/components/hangman3";
import HangmanRulesScreen from "./assets/src/components/hangmanrules";
import LevelSelectorScreen from "./assets/src/components/hangmanlevel";
import AntiDopingSnakesAndLadders from "./assets/src/components/simulation";
import SnakeLadderRulesScreen from "./assets/src/components/snakeandladder";
import SubstanceSortGame1 from "./assets/src/components/sort1";
import SubstanceSortGame2 from "./assets/src/components/sort2";
import SubstanceSortRulesScreen from "./assets/src/components/sortrules";
import SortLevelSelectorScreen from "./assets/src/components/sortlevel";
import TUEAssistant from "./assets/src/components/tue";
import Message from "./assets/src/components/message";
import DiscussionForumScreen from "./assets/src/screens/forum";
import CreateForumModal from "./assets/src/components/createforum";
import ForumDetailScreen from "./assets/src/components/forummsg";
import ChatListScreen from "./assets/src/screens/ChatListScreen";
import CaseStudies from './assets/src/screens/CaseStudies';
import DopingScandals from './assets/src/components/DopingScandalsTimeline';
import ImageTextExtractor from './assets/src/screens/ImageTextExtractor';
import Podcastcomp from './assets/src/components/Podcastcomp';
import NewsDisplay from "./assets/src/components/News";
import CaseStud from './assets/src/screens/StatsPage';
import Journals from "./assets/src/components/Journals";
import LandingPage from "./assets/src/screens/LandingPage";
import ModulesScreen from './assets/src/screens/ModuleScreen'; 
import ChaptersScreen from './assets/src/screens/ChapterScreen';
import VideoScreen from './assets/src/screens/VideoScreen';
import QuizScreen from './assets/src/screens/QuizScreen';
import ModuleQuizScreen from './assets/src/screens/ModuleQuizScreen';
import edumodulequiz from './assets/src/screens/edumodulequiz';
import allactivity from "./assets/src/components/profile/allactivity";
import EditProfile from "./assets/src/components/profile/EditProfile";
import funmodulequiz from "./assets/src/screens/funmodulequiz";

import SearchScreen from "./assets/src/screens/SearchScreen"
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage" screenOptions={{ cardStyle: { height: "100%" } }}>
        {/* Welcome Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeCoach"
          component={HomeCoachScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeExpert"
          component={HomeExpertScreen}
          options={{ headerShown: false }}
        />
        {/* Profile Screens */}
        
        
        <Stack.Screen
          name="allactivity"
          component={allactivity}
          options={{ headerShown: false }}
        />
        {/* Other Screens */}
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hangman"
          component={Hangman}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hangman1"
          component={Hangman1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hangman2"
          component={Hangman2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hangman3"
          component={Hangman3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sort"
          component={Sort}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sort1"
          component={SubstanceSortGame1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sort2"
          component={SubstanceSortGame2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Simulation"
          component={AntiDopingSnakesAndLadders}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Scramble"
          component={Scramble}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz"
          component={Quiz}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz1"
          component={Quiz1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz2"
          component={Quiz2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz3"
          component={Quiz3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Crossword"
          component={CrosswordGame}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Crossword1"
          component={CrosswordGame1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Crossword2"
          component={CrosswordGame2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Crossword3"
          component={CrosswordGame3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Memory Game"
          component={MemoryGame}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Pill Race"
          component={PillRace}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfilePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Post"
          component={Post}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Crossword Rules"
          component={CrosswordRulesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Crossword Level"
          component={CrosswordLevelSelector}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz Rules"
          component={QuizRulesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz Category"
          component={CategorySelectionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hangman Rules"
          component={HangmanRulesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hangman Level"
          component={LevelSelectorScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Snake And Ladder"
          component={SnakeLadderRulesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sort Rules"
          component={SubstanceSortRulesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sort Level"
          component={SortLevelSelectorScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TUE"
          component={TUEAssistant}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Message"
          component={Message}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Forum"
          component={DiscussionForumScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Create Forum"
          component={CreateForumModal}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Forum msg"
          component={ForumDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat List"
          component={ChatListScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="DopingScandals"
          component={DopingScandals}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CaseStudies"
          component={CaseStudies}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="NewsDisplay"
          component={NewsDisplay}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CaseStud"
          component={CaseStud}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ImageTextExtractor"
          component={ImageTextExtractor}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Podcast"
          component={Podcastcomp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Journals"
          component={Journals}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />
         
        <Stack.Screen name="ModuleScreen" component={ModulesScreen} />
        <Stack.Screen name="ChaptersScreen" component={ChaptersScreen} options={{ title: 'Chapters' }} />
        <Stack.Screen name="VideoScreen" component={VideoScreen} options={{ title: 'Video' }} />
        <Stack.Screen name="QuizScreen" component={QuizScreen} options={{ title: 'Chapter Quiz' }} />
        <Stack.Screen name="ModuleQuizScreen" component={ModuleQuizScreen} options={{ title: 'Module Quiz' }} />
        <Stack.Screen name="edumodulequiz" component={edumodulequiz} options={{ title: 'Module Quiz' }} />
        <Stack.Screen name="funmodulequiz" component={funmodulequiz} options={{ title: 'Module Quiz' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
