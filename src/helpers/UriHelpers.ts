export class UriHelpers { 
    public static baseUrl = 'http://www.vlsitechnology.com';
    public static eCardsUrl: string = '/api/ecards';
    public static eCardsPaginationUrlGenral: string = '/api/ecardsdetails?PageNumber=1&PageSize=5';
    public static eCardsPaginationUrl: string = '/api/ecardsdetails/category-name?PageNumber=1&PageSize=5';
    public static eCardUrl: string = '/api/ecard/id';
    public static eCardsByCategoryUrl: string = '/api/category/category-name/ecards';
    public static upsertUserPostInfo : string = '/api/user-post-info';
    public static upsertUserInfo : string = '/api/user';
    public static favoritesPostUrl : string = '/api/favorites/socialId';
    public static updateSharedPostUrl : string = '/api/favorites/socialId';
    // public static updatesUserLikesUrl: string = '/api/user-post-info/socialId/postId';
    // public static updatesLikesInImpressionUrl: string = '/api/ecard/impressionId/likesCount';
  }  