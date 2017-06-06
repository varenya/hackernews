import React from 'react';
export default () => (BaseComponent) => {
                    return (props) => {
                            console.log(props,"properties");
                            return <BaseComponent {...props} />
                    }
};
