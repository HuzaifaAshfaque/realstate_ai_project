import React from 'react';
import classNames from 'classnames';

const Message = ({ message, isUser }) => {
  return (
    <div
      className={classNames('max-w-3xl rounded-lg p-4 mb-4', {
        'bg-primary-light text-white self-end': isUser,
        'bg-gray-100 text-gray-800 self-start': !isUser,
      })}
    >
      <div className="text-sm font-semibold mb-1">
        {isUser ? 'You' : 'Real Estate Bot'}
      </div>
      <div>{message}</div>
    </div>
  );
};

export default Message;