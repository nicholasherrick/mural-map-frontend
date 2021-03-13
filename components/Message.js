const getStyle = ({ message }) => {
    let baseClass = 'alert ';
    if (message.msgError) baseClass = baseClass + 'alert-danger';
    else baseClass = baseClass + 'alert-primary';
    return baseClass + ' text-center';
};

const Message = ({ message }) => {
    console.log(message);
    return (
        <div>
            <div className={getStyle({ message })} role="alert">
                {message.msgBody}
            </div>
        </div>
    );
};

export default Message;
