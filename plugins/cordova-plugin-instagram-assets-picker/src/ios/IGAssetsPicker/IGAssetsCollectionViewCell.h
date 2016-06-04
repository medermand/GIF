//
//  IGAssetsCollectionViewCell.h
//  InstagramAssetsPicker
//
//  Created by JG on 2/3/15.
//  Copyright (c) 2015 JG. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import <Photos/Photos.h>
@interface IGAssetsCollectionViewCell : UICollectionViewCell

- (void)applyAsset:(PHAsset *)asset;
@end
