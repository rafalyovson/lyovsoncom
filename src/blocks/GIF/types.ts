export interface GIFBlock {
  embedCode: {
    postId: string
    aspectRatio: string
  }
  caption?: {
    root: {
      children: any[]
      direction: null | 'ltr' | 'rtl'
      format: string
      indent: number
      type: string
      version: number
    }
  }
  blockType: 'gif'
}
