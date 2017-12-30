import React, { Component } from 'react'
import api from '../../utils/api';
import helper from '../../utils/helper';

export default class Issue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            loading: false,
            err: null,
            votes: undefined
        }

        this.fetchComments = this.fetchComments.bind(this)
        this.deleteIssue = this.deleteIssue.bind(this);
    }

    // TODO: delete the issue from the server and list view here.
    deleteIssue(issue) {
        console.log('delete', issue.id);

    }

    fetchComments(issue) {
        const self = this;
        console.log('clicked', issue.id);
        if (!self.state.loading) {
            self.setState({ loading: true, err: null });
            const user = this.state.currentUser;
            api.getVotesForIssueId(issue.id).then((data) => {
                const issueVotes = data;
                console.log(JSON.stringify(issueVotes));
                self.setState({ loading: true, votes: issueVotes });
            }).catch((err) => {
                self.setState({ loading: false, err: err })
            });
        }
    }

    render() {
        const self = this;
        const issue = self.props.issue;
        const votes = self.state.votes;
        return (
            <div>
                <div className="issue-row issue-text">

                    <span className="pull-right">
                        <i onClick={() => self.fetchComments(issue)} className="issue-row-icon fa fa-3x fa-comments" aria-hidden="true"></i>
                        {/* <i onClick={() => self.deleteIssue(issue)} className="issue-row-icon fa fa-3x fa-trash-o" aria-hidden="true"></i> */}
                    </span>
                    <h3 className="pull-left">
                        Issue: <b>{issue.title}</b>

                    </h3>
                    <p className="centered">Issue Description: <b>{issue.description}</b></p>
                    <p>Issue Created: <b>{helper.formatDateTimeMs(issue.time)}</b></p>

                    {self.state.err && <div className="error-text">
                        {self.state.err.statusText}
                    </div>}

                    {(votes !== undefined && votes.length == 0) && <div>No Votes yet.</div>}
                    {(votes !== undefined && votes.length > 0) && <div>
                        <h5>Net Vote Score: {helper.getAgreeScoreFromVotes(votes)}</h5>
                        {votes.map((vote, index) => {
                            return (<div key={index} className="vote-item">
                                <p>Vote: <b>{helper.convertAgreeToText(vote.agree)}</b></p>
                                <p>Comment: {vote.message}</p>
                                <p>Time: <b>{helper.formatDateTimeMs(vote.time)}</b></p>
                            </div>);
                        })}
                    </div>}
                </div>
            </div>
        )
    }
}
