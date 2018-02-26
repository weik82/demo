import React from 'react';
import config from './config.json';
import styles from './Greeter.css';
class Greeter extends React.Component {
  render() {
    return <div className={styles.root}>
      <h1>Hello, webapck!</h1>  
      <p>{config.greetText}</p>
    </div>;
  }
}

export default Greeter;
