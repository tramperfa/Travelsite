import Story from '../logic/models/story'
import Draft from '../logic/models/draft'

export const checkLogin = (context) => {
  if (!context.sessionUser) {
    return new Error('User Not Logged In')
  }
}

export const storyCheckLoginAndOwnerShip = async(storyID, context) => {
  if (!context.sessionUser) {
    return new Error('User Not Logged In')
  }
  var story = await Story.findById(storyID).populate('author')
  console.log(story);
  if (!story || !story.author.equals(context.sessionUser.user._id)) {
    return new Error('Reqested story does not exist')
  }
  return story
}

export const draftCheckLoginAndOwnerShip = async(draftID, context) => {
  if (!context.sessionUser) {
    return new Error('User Not Logged In')
  }
  var draft = await Draft.load(draftID)
  if (!draft || !draft.author.equals(context.sessionUser.user._id)) {
    return new Error('Reqested draft does not exist')
  }
  return draft
}
