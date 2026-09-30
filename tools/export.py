#!/usr/bin/env python3
"""Build school.json from ArtifactData exports (dbx/school_items, dbx/sync_events)."""
import json,glob,os,sys,datetime
src=sys.argv[1] if len(sys.argv)>1 else 'dbx'
def load(col):
    out=[]
    for f in sorted(glob.glob(os.path.join(src,col,'*.json'))):
        d=json.load(open(f));d['id']=os.path.splitext(os.path.basename(f))[0];d.pop('mid',None);out.append(d)
    return out
data={'updated':datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),'items':load('school_items'),'events':load('sync_events')}
json.dump(data,open(sys.argv[2] if len(sys.argv)>2 else 'school.json','w'),ensure_ascii=False,indent=1)
print(len(data['items']),'items',len(data['events']),'events')
