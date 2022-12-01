import React from "react";
import "./style.css";
import avatar from "./avatar.jpg";
import dog1 from "./dog-image-1.jpg";
import dog2 from "./dog-image-2.jpg";
import dog3 from "./dog-image-3.jpg";

function Landing() {
  return (
    <>
      <div class="container">
        <div class="round-box box1"></div>
        <div class="phone">
          <div class="notch"></div>
          <div class="phone-header">
            <p class="symbol">&lang;</p>
            <figure class="profile">
              <img alt="" src={avatar} />
              <div>
                <p class="one">Samuel Green</p>
                <p class="two">Available to Walk</p>
              </div>
            </figure>
          </div>
          <p class="left-chat">That sounds great. I’d be happy with that.</p>
          <p class="left-chat">
            Could you send over some pictures of your dog, please?
          </p>
          <div class="images">
            <figure class="image">
              <img src={dog1} alt="a dog smiling" />
            </figure>

            <figure class="image">
              <img src={dog2} alt="a dog sitting" />
            </figure>

            <figure class="image">
              <img src={dog3} alt="dog holding a log" />
            </figure>
          </div>
          <p class="right-chat first">
            Here are a few pictures. She’s a happy girl!
          </p>
          <p class="right-chat second">Can you make it?</p>
          <p class="left-chat">
            She looks so happy! The time we discussed works. How long shall I
            take her out for?
          </p>
          <div class="check-chat">
            <div class="checkbox"></div>
            <p class="check-text">30 minute walk</p>
            <p class="check-price">$29</p>
          </div>
          <div class="check-chat">
            <div class="checkbox"></div>
            <p class="check-text">1 hour walk</p>
            <p class="check-price">$49</p>
          </div>
          <div class="input">
            <p>Type a message…</p>
            <p>&rang;</p>
          </div>
        </div>

        <div class="text-box">
          <h1>Simple Chatting app</h1>
          <p class="outer-text">
            Stay in touch with your friends through the chat interface. This
            makes it easy to discuss arrangements and other things.
          </p>
        </div>
      </div>

      <div class="round-box box2"></div>
    </>
  );
}

export default Landing;
