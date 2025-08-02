import { describe, expect, test, beforeEach, afterEach } from 'vitest'
import { ensureEndpointPathCorrect } from './misc.js'

describe('Path check', () => {
  test('Do it', () => {
    expect(() => ensureEndpointPathCorrect('/tmpl/issue', 'file:///foo/bar/pages/tmpl/issue.astro')).not.toThrow()
    expect(() => ensureEndpointPathCorrect('/foo/issues', 'file:///foo/bar/pages/tmpl/issues.astro')).toThrow()
    expect(() => ensureEndpointPathCorrect('/tmpl/issuesfoo', 'file:///foo/bar/pages/tmpl/issues.astro')).toThrow()

    expect(() => ensureEndpointPathCorrect('/posts', 'file:///foo/bar/pages/posts/index.astro')).not.toThrow()
    expect(() => ensureEndpointPathCorrect('/doc/posts', 'file:///foo/bar/pages/posts/index.astro')).toThrow()
    expect(() => ensureEndpointPathCorrect('/posts', 'file:///foo/bar/pages/posts.astro')).not.toThrow()

    expect(() => ensureEndpointPathCorrect('/posts', 'file:///Users/knaka/repos/github.com/knaka/ayutayaweb/dist/pages/posts/_---page_.astro.mjs?time=foobar')).not.toThrow()
    expect(() => ensureEndpointPathCorrect('/tmpl/issue', 'file:///Users/knaka/repos/github.com/knaka/ayutayaweb/dist/pages/tmpl/issue.astro.mjs?time=1741666866951')).not.toThrow()
  });
});
