import React from "react";
import { styles } from "../styles/style";

type Props = {};

const Policy = (props: Props) => {
  return (
    <div>
      <div className={"w-[95%] 800px:w-[92%] m-auto py-2 text-black dark:text-white px-3"}>
        <h1 className={`${styles.title} !text-start pt-2`}>
          Platform Terms and Condition
        </h1>
      <ul style={{ listStyle: "unset", marginLeft: "15px" }}>
      <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
          Every course will be at the worth of ₹99 which is very less I think so the money is nonrefundable and the course will be valid for one month only.
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
        You can select any course from class 9th 10th 11th 12th and every subject will be worth of 99 rupees and once you purchase it will not be refundable
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
       Once you purchase the course we will make sure that every question of the particular textbooks is coveredand none of the questions will be missing.
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
       You can select a 1 book also for example the course may be complete rs agrawal with solution so we will be focusing on each and every questions which will be solved within two to 3 minutes.
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
        There will be two type of courses one will be advanced and one will be normal the advance will be for the competitive exams like iit ntsc and neat and the normal courses will be from the point of cvse and state board exams.
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
       There can be a way in which you can purchase the course for three months 6 months and 12 monthsvalidity but the courses will be of the 10 days trialsand within 10 days onlywe can refund once you are booking for 6 month and 12 months for three months and one months refundable is not allowed.
        </p>
      </ul>
      </div>
    </div>
  );
};

export default Policy;
