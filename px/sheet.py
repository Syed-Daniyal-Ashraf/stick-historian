import sys,glob
from PIL import Image, ImageDraw
files=sorted(glob.glob(sys.argv[1]+'/f*.png')); labels=sys.argv[3:]
cols=int(sys.argv[2]) if len(sys.argv)>2 else 4
ims=[Image.open(f) for f in files]
w,h=ims[0].size; s=0.62; W,H=int(w*s),int(h*s)
rows=(len(ims)+cols-1)//cols
sheet=Image.new('RGB',(cols*W,rows*(H+22)),'#222')
d=ImageDraw.Draw(sheet)
for i,im in enumerate(ims):
  x,y=(i%cols)*W,(i//cols)*(H+22)
  sheet.paste(im.resize((W,H)),(x,y+22)); d.text((x+4,y+4),labels[i] if i<len(labels) else files[i][-8:],fill='#ff0')
sheet.save(sys.argv[1]+'/sheet.png'); print(sheet.size)
