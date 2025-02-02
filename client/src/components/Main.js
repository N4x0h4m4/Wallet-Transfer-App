import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

function Main() {
  const { connectWallet, sendTransaction, handleChange, inputFormData } = useContext(TransactionContext);

  const handleSubmit = () => {
    console.log(inputFormData.addressTo);
    console.log(inputFormData.amount);

    if (inputFormData.addressTo === "" || inputFormData.amount === "") {
      return;
    } else {
      sendTransaction();
    }
  };

  return (
    <div className='mainContainer'>
      {/**左側 */}
      <div className='cryptoContainer'>
        <h1>Crypto Card</h1>
        <button onClick={connectWallet}>
          <p className='buttonText'>ウォレット連携</p>
        </button>
      </div>
      {/**右側 */}
      <div className='inputContainer'>
        <input
          type='text'
          placeholder='アドレス'
          name='addressTo'
          onChange={(e) => handleChange(e, "addressTo")}
        />
        <input
          type='number'
          placeholder='通貨(ETH)'
          name='amount'
          step={0.0001}
          onChange={(e) => handleChange(e, "amount")}
        />
        <button type='button' onClick={handleSubmit}>送信</button>
      </div>
    </div>
  );
}

export default Main;
