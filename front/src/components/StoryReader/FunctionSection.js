import React from 'react';
import {Link} from 'react-router-dom';
import format from 'date-fns/format';

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
		<div className="storyInfo">
			<div className="authorInfo">
				<div>
					{story.author.fullName + ' '}
					{format(new Date(story.lastUpdate), "YYYY-MM-DD HH:mm")}

					{' TBD ViewCount'}
				</div>
				<div>
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
			</div>
			<div className="readerActions">
				<div className="readerActionItem">
					<IconButton aria-label="Like" onClick={handleLike}>
						{
							state.liked
								? <Favorite/>
								: <FavoriteBorder/>
						}
					</IconButton>
					<div>{story.likeStoryCount + " Likes"}</div>
				</div>
				<div className="readerActionItem">
					<IconButton aria-label="Archive" onClick={handleArchive}>
						{
							state.archived
								? <Star/>
								: <StarBorder/>
						}
					</IconButton>
					<div>{story.archiveStoryCount + " Archives"}</div>
				</div>
				<div className="readerActionItem">
					<IconButton aria-label="Comment">
						<Comment/>
					</IconButton>
					<div>{story.commentCount + " Comments"}</div>
				</div>
				<div className="readerActionItem">
					<IconButton aria-label="Share">
						<Share/>
					</IconButton>
					<div>{"Share"}</div>
				</div>

			</div>

		</div>
	)
}

export default FunctionSection
