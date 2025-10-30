import React from "react";
import { styles } from "../styles/style";

const About = () => {
  return (
    <div className="text-black dark:text-white">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        What is <span className="text-gradient">PI-Academy?</span>
      </h1>
      
      <br />
      <div className="w-[95%] 800px:w-[85%] m-auto">
      <p className="text-[18px] font-Poppins">
        Are you ready to take your Mathematics and Physics knowledge and problem solving skills at the next level?
          Look no further than PiAcademy the premier knowledge community dedicated
          to helping new learner to achieve their goals and to reach their full potential.
          <br />
          <br />
          As the founder and CEO of Pi Academy ,I know first hand the challenges
          that come with the learning Mathematics and Physics and simultaneously scoring in Academy as well as competetive exams like ntse,olympiad,neet , jee mains and advance.
          that is why I created  PI-Academy to provide a new students with the
          resources and support they need to succeed.
          <br />
          <br />
          Our website is a treasury drop of information informative video on
          everything from Mathematics and Physics basics to advanced technique.
          But that is just the beginning . our affordable courses are designed to give you
          the high quality education you need to succeed in your life
          without breaking the bank.
          <br />
          <br />
          At PiAcademy we believe that the price should never be barrier to
          achieve your dreams that is why our courses are priced low so that
          anyone regardless of their financial situationcan access the tools
          and the knowledge they need to succeed
          <br />
          <br />
          but PiAcademy is more than just a community we are a family our supportive
          community of like minded individual is here to help you every step of the
          way whether you are just starting out or looking to take your knowledge to the
          next level.
          <br />
          <br />
          with PiAcademy by your side there is nothing standing between you and
          your dream college. our courses and community will provide you with the guidance support
          and the motivationyou need to unleash your full potential and become a top ranker.
          <br />
          <br />
          So what are you waiting for? Join the PI-Academy family today and let&apos;s
          conquer the exam fear together! With our affordable
          courses, informative videos, and supportive community, the sky&apos;s
          the limit.
        </p>
        <br />
        <span className="text-[22px]">Rahul Dixit</span>
        <h5 className="text-[18px] font-Poppins">
          Founder and CEO of PI-Academy
        </h5>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default About;
