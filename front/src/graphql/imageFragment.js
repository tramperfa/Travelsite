import gql from 'graphql-tag';

////// FRAGMENT

export const IMAGE_FILE_FRG = gql `
    fragment image on ImageFile {
        filename
        size{
          width
          height
        }
    }
`;

export const HEADLINE_IMAGE_FRG = gql `
    fragment headlineImage on Image {
      _id
      browserHeadlineImage{
        ...image
      }
      originalImage{
        ...image
      }
    }
    ${IMAGE_FILE_FRG}
`;

export const COVER_IMAGE_FRG = gql `
      fragment coverImage on Image {
        _id
        browserCoverImage{
          ...image
        }
        browserUserHomeCoverImage{
          ...image
        }
      }
      ${IMAGE_FILE_FRG}
`;

export const STORY_IMAGE_FRG = gql `
    fragment storyImage on Image {
        _id
          browserStoryImage{
            ...image
          }
          # browserCommentImage{
          #   ...image
          # }
    }
    ${IMAGE_FILE_FRG}
`;

export const AVATAR_IMAGE_FRG = gql `
    fragment avatarImage on Image {
        _id
        avatar20px{
          filename
        }
        avatar36px{
            filename
        }
        avatar48px{
            filename
        }
        avatar124px{
            filename
        }
    }
`;

export default IMAGE_FILE_FRG
