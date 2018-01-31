import React from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';

//
import IconButton from 'material-ui/IconButton';
import FavoriteBorder from "material-ui-icons/FavoriteBorder";
import StarBorder from "material-ui-icons/StarBorder";
import Favorite from "material-ui-icons/Favorite";
import Star from "material-ui-icons/Star";
import Comment from "material-ui-icons/Comment";
import Edit from "material-ui-icons/Edit";
import Delete from "material-ui-icons/Delete";
import Share from "material-ui-icons/Share";
//import Reply from "material-ui-icons/Reply";

const FunctionSection = (
	{state, story, handleLike, handleDelete, handleArchive}
) => {
	console.log(story);
	return (
		<div>
			<div>
				{story.author.fullName + ' '}
				{moment(new Date(story.lastUpdate)).utc().local().format("YYYY-MM-DD HH:mm")}
				{' TBD ViewCount'}
			</div>
			<div>
				<IconButton aria-label="Like" onClick={handleLike}>
					{
						state.liked
							? <Favorite/>
							: <FavoriteBorder/>
					}
				</IconButton>
				<span>{story.likeStoryCount + "Likes"}</span>
				<IconButton aria-label="Archive" onClick={handleArchive}>
					{
						state.archived
							? <Star/>
							: <StarBorder/>
					}
				</IconButton>
				<span>{story.archiveStoryCount + "Archives"}</span>
				<IconButton aria-label="Comment">
					<Comment/>
				</IconButton>
				<span>{story.commentCount + "Comments"}</span>
				<IconButton aria-label="Share">
					<Share/>
				</IconButton>
				<span>{"Share"}</span>
			</div>

			{
				(state.isAuthor) && (
					<span>
						<Link to={`/edit/${story.draft}`}>
							<IconButton aria-label="Edit">
								<Edit/>
							</IconButton>
						</Link>
						<span>{"Edit Story"}</span>
						<IconButton aria-label="Delete" onClick={handleDelete}>
							<Delete/>
						</IconButton>
						<span>{"Delete Story"}</span>
					</span>
				)
			}
		</div>
	)
}

export default FunctionSection
