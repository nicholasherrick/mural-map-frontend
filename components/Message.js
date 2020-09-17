const getStyle = (props) => {
  let baseClass = 'alert ';
  if (props.message.msgError) baseClass = baseClass + 'alert-danger';
  else baseClass = baseClass + 'alert-primary';
  return baseClass + ' text-center';
};

const Message = (props) => {
  return (
    <div>
      <div className={getStyle(props)} role='alert'>
        {props.message.msgBody}
      </div>
      <style jsx>{`
        .alert-danger {
          color: red;
        }

        .alert-primary {
          color: green;
        }
      `}</style>
    </div>
  );
};

export default Message;
