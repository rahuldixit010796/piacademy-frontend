import { styles } from "@/app/styles/style";
import Image from "next/image";
import React from "react";
import ReviewCard from "../Review/ReviewCard";

type Props = {};

export const reviews = [
  {
    name: "Vivan",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Student | kensari school",
    comment:
    "I had the pleasure of exploring PI-Academy, a website that provides an extensive range of courses on various academic related topics. I was thoroughly impressed with my experience, as the website offers a comprehensive selection of clases that cater to different  levels and interests. If you're looking to enhance your knowledge in the academic performance in your class, I highly recommend checking out PI-Academy!",
},
  {
    name: "Vishal ",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profession: "student | kendriya vidyalaya hebbal",
    comment:
    "Thanks for your amazing mathematics tutorial channel! Your teaching style is outstanding, and the quality of your tutorials is top-notch. Your ability to break down complex topics into manageable parts, and cover diverse mathematical analysis and topics is truly impressive. The practical applications and real-world examples you incorporate reinforce the theoretical knowledge and provide valuable insights. Your engagement with the audience fosters a supportive learning environment. Thank you for your dedication, expertise, and passion for teaching programming, and keep up the fantastic work!",
},
  {
    name: "Harshit",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    profession: "student | fedral public school",
    comment:
    "Thanks for your amazing physics tutorial channel! Your teaching style is outstanding, and the quality of your tutorials is top-notch. Your ability to break down complex topics into manageable parts, and cover diverse critical analysis of topics is truly impressive. The practical applications and real-world examples you incorporate reinforce the theoretical knowledge and provide valuable insights. Your engagement with the audience fosters a supportive learning environment. Thank you for your dedication, expertise, and passion for teaching programming, and keep up the fantastic work!"},
  {
    name: "Aayush",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    profession: "student | st. joseph school",
    comment:
    "I had the pleasure of exploring PI-Academy, a website that provides an extensive range of courses on various tech-related topics. I was thoroughly impressed with my experience",
},
  {
    name: "shravan ",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    profession: "student | kensari school",
    comment:
    "Your content is very special. The thing I liked the most is that the videos are so long, which means they cover everything in details. for that any person had beginner-level can complete an integrated project when he watches the videos. Thank you very much. Im very excited for the next videos Keep doing this amazing work",
},
  {
    name: "Rahul ",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    profession: "student | army public school",
    comment:
    "Join PI-Academy! PI-Academy focuses on practical applications rather than just teaching the theory behind mathematics,physiscs and chemistry. I took a lesson on all three that was physics,chemistry and mathematics and it was very helpful in making me understand all the topics and secure good marks in my class 10th. Overall, I highly recommend PI-Academy to anyone looking to improve their academic performance if they want to improve there marks in board exams. PI-Academy is a great resource that will help you take your knowledge of mathematics,physics and chemistry to the next level.",
},
];

const Reviews = (props: Props) => {
  return (
  <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center">
      <div className="800px:w-[50%] w-full">
        <Image
        src={require("../../../public/assests/business-img.png")}
        alt="business"
        width={700}
        height={700}
        />
        </div>
        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            Our Students Are <span className="text-gradient">Our Strength</span>{" "}
            <br /> See What They Say About Us
          </h3>
          <br />
         
        </div>
        <br />
        <br />
       </div>
       <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 md:[&>*:nth-child(3)]:!mt-[-60px] md:[&>*:nth-child(6)]:!mt-[-20px]">
        {reviews &&
            reviews.map((i, index) => <ReviewCard item={i} key={index} />)}
        </div>
  </div>
  );
};

export default Reviews;
