import React from 'react'
import Heading from '../components/Heading';
import SubHeading from '../components/SubHeading';
import InputBox from '../components/InputBox';
import Button from '../components/Button';
import BottomWarning from '../components/BottomWarning';

function Signin() {
  return (
    <div className='h-screen bg-slate-300 flex justify-center'>
      <div className='flex flex-col justify-center'>
        <div className='bg-white w-80 rounded-lg text-center p-2 px-4 h-max'>
            <Heading label={'Sign In'}/>
            <SubHeading description={'Enter Your Credentials To Access Your Account'}/>
            <InputBox name={'Email'} place={'jhondoe@example.com'}/>
            <InputBox name={'Password'} place={'******'}/>
            <Button btnName={'Sign In'}/>
            <BottomWarning label={"Don't have an account?"} buttonText={'Sign up'} to={'/signup'}/>
        </div>
      </div>
    </div>
  )
}

export default Signin