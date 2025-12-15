# 1'GFE'Ì '3*A'/G '2 API E/Ì1Ì* 13'FGG' (*5'HÌ1 H HÌ/ÌHG') (1'Ì CMS

'ÌF E3*F/ 1'GFE'Ì ©'ED '3*A'/G '2 API G'Ì E/Ì1Ì* *5'HÌ1 H HÌ/ÌHG' (1'Ì ~FD E/Ì1Ì* (CMS) 1' '1'&G EÌ/G/.

## =Ë AG13* E7'D(

- ['-1'2 GHÌ*](#'-1'2-GHÌ*)
- [API E/Ì1Ì* *5'HÌ1](#api-E/Ì1Ì*-*5'HÌ1)
- [API E/Ì1Ì* HÌ/ÌHG'](#api-E/Ì1Ì*-HÌ/ÌHG')
- [3'.*'1 ~'3.G'Ì API](#3'.*'1-~'3.G'Ì-api)
- [©/G'Ì .7'](#©/G'Ì-.7')
- [FEHFGG'Ì ©/](#FEHFGG'Ì-©/)

---

## = '-1'2 GHÌ*

*E'EÌ endpoint G'Ì 'ÌF API FÌ'2 (G '-1'2 GHÌ* /'1F/ H AB7 ©'1(1'F (' FB4 `ADMIN` EÌ*H'FF/ (G "FG' /3*13Ì /'4*G ('4F/.

**Headers EH1/ FÌ'2:**
```http
Cookie: authjs.session-token=<session-token>
```

**~'3.G'Ì .7':**
- `401 Unauthorized`: ©'1(1 H'1/ F4/G '3*
- `403 Forbidden`: ©'1(1 '/EÌF FÌ3*

---

## =¼ API E/Ì1Ì* *5'HÌ1

### 1. /1Ì'A* DÌ3* *5'HÌ1

/1Ì'A* DÌ3* *5'HÌ1 (' B'(DÌ* AÌD*1 H 5A-G(F/Ì

**Endpoint:**
```
GET /api/admin/images
```

**Query Parameters:**

| ~'1'E*1 | FH9 | ~Ì4A16 | *H6Ì-'* |
|---------|-----|---------|---------|
| `page` | number | 1 | 4E'1G 5A-G |
| `limit` | number | 20 | *9/'/ "Ì*E /1 G1 5A-G (-/'©+1 100) |
| `search` | string | - | ,3*,H /1 9FH'F H *H6Ì-'* |
| `category` | string | - | AÌD*1 (1 '3'3 /3*G(F/Ì |

**/3*G(F/ÌG'Ì E9*(1:**
- `PROFILE` - *5'HÌ1 ~1HA'ÌD
- `BANNER` - *5'HÌ1 (F1
- `COURSE` - *5'HÌ1 /H1G
- `BLOG` - *5'HÌ1 (D'¯
- `OTHER` - 3'Ì1

**E+'D /1.H'3*:**
```bash
curl -X GET "https://api.example.com/api/admin/images?page=1&limit=20&category=COURSE" \
  -H "Cookie: authjs.session-token=<token>"
```

**~'3. EHAB (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123...",
      "userId": "clx456...",
      "objectKey": "images/uuid-filename.jpg",
      "url": "https://cdn.example.com/images/uuid-filename.jpg",
      "filename": "image.jpg",
      "mimeType": "image/jpeg",
      "size": 245678,
      "width": 1920,
      "height": 1080,
      "category": "COURSE",
      "title": "9FH'F *5HÌ1",
      "description": "*H6Ì-'* *5HÌ1",
      "alt": "E*F ,'Ì¯2ÌF",
      "tags": ["/H1G", ""EH24"],
      "published": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### 2. /1Ì'A* "E'1 *5'HÌ1

/1Ì'A* "E'1 ©DÌ *5'HÌ1

**Endpoint:**
```
GET /api/admin/images/stats
```

**E+'D /1.H'3*:**
```bash
curl -X GET "https://api.example.com/api/admin/images/stats" \
  -H "Cookie: authjs.session-token=<token>"
```

**~'3. EHAB (200):**
```json
{
  "success": true,
  "data": {
    "totalImages": 150,
    "totalSize": 52428800,
    "byCategory": {
      "PROFILE": 20,
      "BANNER": 15,
      "COURSE": 80,
      "BLOG": 30,
      "OTHER": 5
    },
    "publishedCount": 120,
    "unpublishedCount": 30
  }
}
```

---

### 3. /1Ì'A* '7D'9'* Ì© *5HÌ1

/1Ì'A* '7D'9'* ©'ED Ì© *5HÌ1 .'5

**Endpoint:**
```
GET /api/admin/images/:id
```

**E+'D /1.H'3*:**
```bash
curl -X GET "https://api.example.com/api/admin/images/clx123..." \
  -H "Cookie: authjs.session-token=<token>"
```

**~'3. EHAB (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx123...",
    "url": "https://cdn.example.com/images/uuid-filename.jpg",
    "title": "9FH'F *5HÌ1",
    ...
  }
}
```

---

### 4. "~DH/ *5HÌ1 ,/Ì/

"~DH/ Ì© *5HÌ1 ,/Ì/

**Endpoint:**
```
POST /api/admin/images
```

**Content-Type:** `multipart/form-data`

**Body Parameters:**

| ~'1'E*1 | FH9 | 'D2'EÌ | *H6Ì-'* |
|---------|-----|--------|---------|
| `file` | File |  | A'ÌD *5HÌ1 |
| `category` | string | L | /3*G(F/Ì (~Ì4A16: OTHER) |
| `title` | string | L | 9FH'F *5HÌ1 |
| `description` | string | L | *H6Ì-'* |
| `alt` | string | L | E*F ,'Ì¯2ÌF |
| `tags` | string | L | *¯G' ((' ©'E' ,/' 4/G) |

**E+'D /1.H'3*:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('category', 'COURSE');
formData.append('title', '*5HÌ1 /H1G ,/Ì/');
formData.append('tags', '"EH24,(1F'EGFHÌ3Ì');

const response = await fetch('/api/admin/images', {
  method: 'POST',
  body: formData
});
```

**~'3. EHAB (201):**
```json
{
  "success": true,
  "message": "*5HÌ1 (' EHABÌ* "~DH/ 4/",
  "data": {
    "id": "clx123...",
    "url": "https://cdn.example.com/images/uuid-filename.jpg",
    ...
  }
}
```

---

### 5. (G1H213'FÌ *5HÌ1

(G1H213'FÌ '7D'9'* Ì© *5HÌ1

**Endpoint:**
```
PATCH /api/admin/images/:id
```

**Content-Type:** `application/json`

**Body Parameters:**

```json
{
  "title": "9FH'F ,/Ì/",
  "description": "*H6Ì-'* ,/Ì/",
  "alt": "E*F ,'Ì¯2ÌF ,/Ì/",
  "tags": ["*¯1", "*¯2"],
  "category": "COURSE",
  "published": true
}
```

**E+'D /1.H'3*:**
```bash
curl -X PATCH "https://api.example.com/api/admin/images/clx123..." \
  -H "Cookie: authjs.session-token=<token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"9FH'F ,/Ì/","published":true}'
```

**~'3. EHAB (200):**
```json
{
  "success": true,
  "message": "*5HÌ1 (' EHABÌ* (G1H213'FÌ 4/",
  "data": {
    "id": "clx123...",
    ...
  }
}
```

---

### 6. -0A *5HÌ1

-0A Ì© *5HÌ1 ('2 /Ì*'(Ì3 H A6'Ì 0.Ì1G3'2Ì)

**Endpoint:**
```
DELETE /api/admin/images/:id
```

**E+'D /1.H'3*:**
```bash
curl -X DELETE "https://api.example.com/api/admin/images/clx123..." \
  -H "Cookie: authjs.session-token=<token>"
```

**~'3. EHAB (200):**
```json
{
  "success": true,
  "message": "*5HÌ1 (' EHABÌ* -0A 4/",
  "data": {
    "deleted": true
  }
}
```

---

## <¥ API E/Ì1Ì* HÌ/ÌHG'

### 1. /1Ì'A* DÌ3* HÌ/ÌHG'

/1Ì'A* DÌ3* HÌ/ÌHG' (' B'(DÌ* AÌD*1 H 5A-G(F/Ì

**Endpoint:**
```
GET /api/admin/videos
```

**Query Parameters:**

| ~'1'E*1 | FH9 | ~Ì4A16 | *H6Ì-'* |
|---------|-----|---------|---------|
| `page` | number | 1 | 4E'1G 5A-G |
| `limit` | number | 20 | *9/'/ "Ì*E /1 G1 5A-G (-/'©+1 100) |
| `search` | string | - | ,3*,H /1 9FH'F H *H6Ì-'* |
| `status` | string | - | AÌD*1 (1 '3'3 H69Ì* ~1/'24 |

**H69Ì*G'Ì E9*(1:**
- `UPLOADING` - /1 -'D "~DH/
- `UPLOADED` - "~DH/ 4/G ("E'/G ~1/'24)
- `PROCESSING` - /1 -'D ~1/'24
- `READY` - "E'/G ~.4
- `FAILED` - .7' /1 ~1/'24

**E+'D /1.H'3*:**
```bash
curl -X GET "https://api.example.com/api/admin/videos?page=1&limit=20&status=READY" \
  -H "Cookie: authjs.session-token=<token>"
```

**~'3. EHAB (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx789...",
      "videoId": "vid-uuid-123",
      "title": "HÌ/ÌHÌ "EH24Ì React",
      "description": ""EH24 ©'ED React",
      "originalPath": "videos/original/vid-uuid-123.mp4",
      "hlsPlaylistPath": "videos/hls/vid-uuid-123/playlist.m3u8",
      "hlsSegmentsPath": "videos/hls/vid-uuid-123/segments/",
      "thumbnailPath": "videos/thumbnails/vid-uuid-123.jpg",
      "fileSize": 104857600,
      "fileFormat": "mp4",
      "duration": 1800,
      "width": 1920,
      "height": 1080,
      "bitrate": 5000000,
      "codec": "h264",
      "frameRate": 30,
      "processingStatus": "READY",
      "processingError": null,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### 2. /1Ì'A* "E'1 HÌ/ÌHG'

/1Ì'A* "E'1 ©'ED HÌ/ÌHG'

**Endpoint:**
```
GET /api/admin/videos/stats
```

**E+'D /1.H'3*:**
```bash
curl -X GET "https://api.example.com/api/admin/videos/stats" \
  -H "Cookie: authjs.session-token=<token>"
```

**~'3. EHAB (200):**
```json
{
  "success": true,
  "data": {
    "totalVideos": 45,
    "totalSize": 5368709120,
    "totalDuration": 81000,
    "byStatus": {
      "UPLOADING": 2,
      "UPLOADED": 3,
      "PROCESSING": 5,
      "READY": 33,
      "FAILED": 2
    },
    "recentVideos": [
      {
        "id": "clx789...",
        "videoId": "vid-uuid-123",
        "title": "HÌ/ÌHÌ "EH24Ì React",
        "processingStatus": "READY",
        "fileSize": 104857600,
        "duration": 1800,
        "thumbnailPath": "videos/thumbnails/vid-uuid-123.jpg",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

***H6Ì-'* AÌD/G':**
- `totalVideos`: *9/'/ ©D HÌ/ÌHG'
- `totalSize`: E,EH9 -,E *E'E HÌ/ÌHG' (('Ì*)
- `totalDuration`: E,EH9 E/* 2E'F *E'E HÌ/ÌHG' (+'FÌG)
- `byStatus`: *9/'/ HÌ/ÌHG' (1 '3'3 H69Ì*
- `recentVideos`: 5 HÌ/ÌHÌ '.Ì1

---

### 3. /1Ì'A* '7D'9'* Ì© HÌ/ÌH

/1Ì'A* '7D'9'* ©'ED Ì© HÌ/ÌH .'5 ((' '3*A'/G '2 database ID)

**Endpoint:**
```
GET /api/admin/videos/:id
```

**E+'D /1.H'3*:**
```bash
curl -X GET "https://api.example.com/api/admin/videos/clx789..." \
  -H "Cookie: authjs.session-token=<token>"
```

**~'3. EHAB (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx789...",
    "videoId": "vid-uuid-123",
    "title": "HÌ/ÌHÌ "EH24Ì React",
    ...
  }
}
```

**F©*G:** GE†FÌF EÌ*H'FÌ/ '2 `/api/admin/videos/:videoId` (1'Ì /3*13Ì (' videoId '3*A'/G ©FÌ/.

---

### 4. (G1H213'FÌ HÌ/ÌH

(G1H213'FÌ '7D'9'* Ì© HÌ/ÌH

**Endpoint:**
```
PATCH /api/admin/videos/:id
```

**Content-Type:** `application/json`

**Body Parameters:**

```json
{
  "title": "9FH'F ,/Ì/",
  "description": "*H6Ì-'* ,/Ì/",
  "thumbnailPath": "videos/thumbnails/new-thumbnail.jpg"
}
```

**E+'D /1.H'3*:**
```bash
curl -X PATCH "https://api.example.com/api/admin/videos/clx789..." \
  -H "Cookie: authjs.session-token=<token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"9FH'F ,/Ì/ HÌ/ÌH"}'
```

**~'3. EHAB (200):**
```json
{
  "success": true,
  "message": "HÌ/ÌH (' EHABÌ* (G1H213'FÌ 4/",
  "data": {
    "id": "clx789...",
    ...
  }
}
```

---

### 5. -0A HÌ/ÌH

-0A Ì© HÌ/ÌH ('2 /Ì*'(Ì3 H A6'Ì 0.Ì1G3'2Ì)

**Endpoint:**
```
DELETE /api/admin/videos/:id
```

**E+'D /1.H'3*:**
```bash
curl -X DELETE "https://api.example.com/api/admin/videos/clx789..." \
  -H "Cookie: authjs.session-token=<token>"
```

**~'3. EHAB (200):**
```json
{
  "success": true,
  "message": "HÌ/ÌH (' EHABÌ* -0A 4/",
  "data": {
    "deleted": true
  }
}
```

**F©*G:** -0A HÌ/ÌH 4'ED -0A EH'1/ 2Ì1 EÌ4H/:
- A'ÌD '5DÌ HÌ/ÌH
- A'ÌDG'Ì HLS (playlist H segments)
- *5HÌ1 (F/'F¯4*Ì (thumbnail)

---

## =Ê 3'.*'1 ~'3.G'Ì API

### ~'3. EHAB

```json
{
  "success": true,
  "message": "~Ì'E EHABÌ*",
  "data": { ... }
}
```

### ~'3. .7'

```json
{
  "success": false,
  "error": {
    "message": "~Ì'E .7'",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

### ~'3. Paginated

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

##   ©/G'Ì .7'

| ©/ | *H6Ì-'* |
|----|---------|
| `UNAUTHORIZED` | ©'1(1 '-1'2 GHÌ* F4/G |
| `FORBIDDEN` | ©'1(1 /3*13Ì F/'1/ |
| `NOT_FOUND` | EF(9 Ì'A* F4/ |
| `VALIDATION_ERROR` | .7'Ì '9*('13F,Ì |
| `DATABASE_ERROR` | .7'Ì /Ì*'(Ì3 |
| `EXTERNAL_SERVICE_ERROR` | .7'Ì 31HÌ3 .'1,Ì |
| `INTERNAL_ERROR` | .7'Ì /'.DÌ 31H1 |

---

## =» FEHFGG'Ì ©/

### React + Axios

```javascript
import axios from 'axios';

// *F8ÌE'* ~'ÌG
const api = axios.create({
  baseURL: 'https://api.example.com',
  withCredentials: true // (1'Ì '13'D ©H©Ì
});

// /1Ì'A* DÌ3* *5'HÌ1
async function getImages(page = 1, category) {
  try {
    const response = await api.get('/api/admin/images', {
      params: { page, limit: 20, category }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}

// "~DH/ *5HÌ1
async function uploadImage(file, metadata) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', metadata.category);
  formData.append('title', metadata.title);

  try {
    const response = await api.post('/api/admin/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// /1Ì'A* "E'1 HÌ/ÌHG'
async function getVideoStats() {
  try {
    const response = await api.get('/api/admin/videos/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching video stats:', error);
    throw error;
  }
}

// /1Ì'A* DÌ3* HÌ/ÌHG'
async function getVideos(page = 1, status) {
  try {
    const response = await api.get('/api/admin/videos', {
      params: { page, limit: 20, status }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

// -0A HÌ/ÌH
async function deleteVideo(videoId) {
  try {
    const response = await api.delete(`/api/admin/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
}
```

### React Query Hook

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// /1Ì'A* DÌ3* *5'HÌ1
function useImages(page, category) {
  return useQuery({
    queryKey: ['images', page, category],
    queryFn: () => getImages(page, category)
  });
}

// "~DH/ *5HÌ1
function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, metadata }) => uploadImage(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    }
  });
}

// /1Ì'A* "E'1 HÌ/ÌHG'
function useVideoStats() {
  return useQuery({
    queryKey: ['video-stats'],
    queryFn: getVideoStats,
    refetchInterval: 30000 // (G1H213'FÌ G1 30 +'FÌG
  });
}

// '3*A'/G /1 ©'E~HFF*
function AdminVideosPage() {
  const { data: stats, isLoading } = useVideoStats();
  const { data: videos } = useQuery({
    queryKey: ['videos', 1, 'READY'],
    queryFn: () => getVideos(1, 'READY')
  });

  if (isLoading) return <div>/1 -'D ('1¯0'1Ì...</div>;

  return (
    <div>
      <h1>"E'1 HÌ/ÌHG'</h1>
      <p>*9/'/ ©D: {stats.data.totalVideos}</p>
      <p>-,E ©D: {(stats.data.totalSize / 1024 / 1024 / 1024).toFixed(2)} GB</p>

      <h2>DÌ3* HÌ/ÌHG'</h2>
      {videos?.data.map(video => (
        <div key={video.id}>
          <h3>{video.title}</h3>
          <p>H69Ì*: {video.processingStatus}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## =Ý F©'* EGE

### *5'HÌ1
- A1E*G'Ì ~4*Ì('FÌ4/G: JPG, PNG, WebP, GIF
- -/'©+1 -,E: 10 MB (B'(D *F8ÌE)
- *5'HÌ1 (G 5H1* .H/©'1 /1 CDN 0.Ì1G EÌ4HF/
- -0A *5HÌ1 '2 /Ì*'(Ì3 A'ÌD 1' FÌ2 '2 storage -0A EÌ©F/

### HÌ/ÌHG'
- A1E*G'Ì ~4*Ì('FÌ4/G: MP4, WebM, MOV
- -/'©+1 -,E "~DH/: 256 MB
- HÌ/ÌHG' (G 5H1* .H/©'1 (G A1E* HLS *(/ÌD EÌ4HF/
- *5HÌ1 (F/'F¯4*Ì (G 5H1* .H/©'1 *HDÌ/ EÌ4H/
- -0A HÌ/ÌH *E'E A'ÌDG'Ì E1*(7 1' -0A EÌ©F/

### 'EFÌ*
- *E'E endpoint G' FÌ'2 (G '-1'2 GHÌ* /'1F/
- AB7 ©'1(1'F (' FB4 ADMIN /3*13Ì /'1F/
- '2 CSRF protection '3*A'/G EÌ4H/
- A'ÌDG'Ì "~DH/ 4/G '9*('13F,Ì EÌ4HF/

---

## = EF'(9 E1*(7

- [1'GFE'Ì "~DH/ HÌ/ÌH](./admin-upload-video-api.md)
- [3'.*'1 ~'3.G'Ì API](./API_RESPONSE_STRUCTURE.md)
- [1'GFE'Ì Ì©~'1†G3'2Ì CMS](./CMS_INTEGRATION_GUIDE.md)
- [E3*F/'* 3Ì3*E HÌ/ÌH](./VIDEO_SYSTEM_README.md)

---

**F3.G:** 1.0.0
**".1ÌF (G1H213'FÌ:** 2024-01-15
**F¯G/'1F/G:** *ÌE *H39G Pishro
