import React from 'react';
import styles from '../styles/Master.module.scss';
import ProfileCard from '../components/ProfileCard';
import PersonalProjects from '../components/PersonalProjects';
import TeamProjects from '../components/TeamProjects';
import Testimonials from '../components/Testimonials';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const App = () => {
  return (
    <div className={styles.banner}>
      <ProfileCard />
      <PersonalProjects />
      <TeamProjects />
      <Testimonials />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
