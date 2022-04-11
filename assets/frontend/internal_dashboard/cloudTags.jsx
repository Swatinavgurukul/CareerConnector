import React, { Component } from 'react';
import TagCloud from 'react-tag-cloud';

class MyCloud extends Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: [
                {
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: '#0D81B9',
                    textTransform: "capitalize"
                },
                {
                    fontSize: 24,
                    fontWeight: 'normal',
                    color: '#009EC0',
                    textTransform: "capitalize"
                },
                {
                    fontSize: 14,
                    color: '#547d78',
                    textTransform: "capitalize"
                },
                {
                    fontSize: 16,
                    color: '#048293',
                    textTransform: "capitalize"
                }
            ]
        };
    }
    componentDidMount() {
        // setInterval(() => {
        //     this.forceUpdate();
        // }, 3000);
    }

    render() {
        return (
            <div className='app-outer'>
                <div className='app-inner'>
                    <TagCloud
                        spiral='archimedean'
                        className='tag-cloud pr-4'
                        style={{
                            fontFamily: 'sans-serif',
                            fontSize: 20,
                            fontWeight: 'bold',
                            // fontStyle: 'italic',
                            width: '100%',
                            height: '100%'
                        }}>
                        {this.props.data.map((data, key) =>
                            <div style={[...this.state.styles, ...this.state.styles, ...this.state.styles, ...this.state.styles][key]}>
                                {data.skills}
                            </div>
                        )}
                    </TagCloud>
                </div>
            </div>
        );
    }
}

export default MyCloud;
